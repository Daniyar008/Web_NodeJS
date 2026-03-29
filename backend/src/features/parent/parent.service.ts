import { ApiError } from "../../lib/apiError.js";
import { prisma } from "../../lib/prisma.js";
import type { CreateGoalDto, LinkStudentDto, SendMessageDto, UpdateGoalDto } from "./parent.schema.js";

// ─── helpers ─────────────────────────────────────────────────────────────────

function clean<T extends object>(obj: T): any {
    return Object.fromEntries(
        Object.entries(obj).filter(([, v]) => v !== undefined)
    ) as any;
}

const userPublic = { id: true, firstName: true, lastName: true, email: true } as const;

// ─── Children management ──────────────────────────────────────────────────────

export async function getChildren(parentId: string) {
    const links = await prisma.parentStudent.findMany({
        where: { parentId },
        include: { student: { select: userPublic } },
        orderBy: { createdAt: "asc" },
    });
    return links.map((l) => l.student);
}

export async function linkStudent(parentId: string, dto: LinkStudentDto) {
    const student = await prisma.user.findUnique({ where: { id: dto.studentId } });
    if (!student) throw ApiError.notFound("Student not found");

    const existing = await prisma.parentStudent.findUnique({
        where: { parentId_studentId: { parentId, studentId: dto.studentId } },
    });
    if (existing) throw ApiError.conflict("Already linked");

    return prisma.parentStudent.create({ data: { parentId, studentId: dto.studentId } });
}

export async function unlinkStudent(parentId: string, studentId: string) {
    const link = await prisma.parentStudent.findUnique({
        where: { parentId_studentId: { parentId, studentId } },
    });
    if (!link) throw ApiError.notFound("Link not found");
    await prisma.parentStudent.delete({ where: { parentId_studentId: { parentId, studentId } } });
}

// ─── Child progress ───────────────────────────────────────────────────────────

async function assertLinked(parentId: string, studentId: string) {
    const link = await prisma.parentStudent.findUnique({
        where: { parentId_studentId: { parentId, studentId } },
    });
    if (!link) throw ApiError.forbidden("Not linked to this student");
}

export async function getChildProgress(parentId: string, studentId: string) {
    await assertLinked(parentId, studentId);

    const [profile, enrollments, recentSubmissions, recentAttempts] = await Promise.all([
        prisma.gamificationProfile.findUnique({ where: { userId: studentId } }),
        prisma.enrollment.findMany({
            where: { studentId },
            include: {
                course: { select: { id: true, title: true, status: true } },
                progress: { select: { completed: true } },
            },
            orderBy: { enrolledAt: "desc" },
            take: 10,
        }),
        prisma.assignmentSubmission.findMany({
            where: { studentId },
            include: { assignment: { select: { title: true, maxScore: true } } },
            orderBy: { submittedAt: "desc" },
            take: 10,
        }),
        prisma.testAttempt.findMany({
            where: { studentId },
            include: { test: { select: { title: true, passingScore: true } } },
            orderBy: { completedAt: "desc" },
            take: 10,
        }),
    ]);

    // Build course progress summary
    const courses = enrollments.map((e) => {
        const total = e.progress.length;
        const done = e.progress.filter((p) => p.completed).length;
        return {
            id: e.course.id,
            title: e.course.title,
            status: e.course.status,
            lessonsTotal: total,
            lessonsDone: done,
            percent: total > 0 ? Math.round((done / total) * 100) : 0,
        };
    });

    return { profile, courses, recentSubmissions, recentAttempts };
}

// ─── Goals ────────────────────────────────────────────────────────────────────

export async function listGoals(parentId: string, studentId: string) {
    await assertLinked(parentId, studentId);
    return prisma.parentGoal.findMany({
        where: { parentId, studentId },
        orderBy: { createdAt: "desc" },
    });
}

export async function createGoal(parentId: string, dto: CreateGoalDto) {
    await assertLinked(parentId, dto.studentId);
    return prisma.parentGoal.create({
        data: {
            title: dto.title,
            ...(dto.description !== undefined ? { description: dto.description } : {}),
            targetXp: dto.targetXp,
            ...(dto.reward !== undefined ? { reward: dto.reward } : {}),
            parentId,
            studentId: dto.studentId,
        },
    });
}

export async function updateGoal(parentId: string, goalId: string, dto: UpdateGoalDto) {
    const goal = await prisma.parentGoal.findUnique({ where: { id: goalId } });
    if (!goal) throw ApiError.notFound("Goal not found");
    if (goal.parentId !== parentId) throw ApiError.forbidden("Not your goal");

    return prisma.parentGoal.update({
        where: { id: goalId },
        data: clean({
            title: dto.title,
            description: dto.description,
            targetXp: dto.targetXp,
            reward: dto.reward,
            achieved: dto.achieved,
            ...(dto.achieved ? { achievedAt: new Date() } : {}),
        }),
    });
}

export async function removeGoal(parentId: string, goalId: string) {
    const goal = await prisma.parentGoal.findUnique({ where: { id: goalId } });
    if (!goal) throw ApiError.notFound("Goal not found");
    if (goal.parentId !== parentId) throw ApiError.forbidden("Not your goal");
    await prisma.parentGoal.delete({ where: { id: goalId } });
}

// ─── Self-check goals against current XP ─────────────────────────────────────

export async function checkGoals(parentId: string, studentId: string) {
    await assertLinked(parentId, studentId);
    const profile = await prisma.gamificationProfile.findUnique({ where: { userId: studentId } });
    if (!profile) return [];

    const pendingGoals = await prisma.parentGoal.findMany({
        where: { parentId, studentId, achieved: false },
    });

    const nowAchieved = pendingGoals.filter((g) => profile.xp >= g.targetXp);
    if (nowAchieved.length > 0) {
        await prisma.$transaction(
            nowAchieved.map((g) =>
                prisma.parentGoal.update({
                    where: { id: g.id },
                    data: { achieved: true, achievedAt: new Date() },
                })
            )
        );
    }
    return nowAchieved;
}

// ─── Messaging ────────────────────────────────────────────────────────────────

export async function listConversations(userId: string) {
    // Get all distinct partner IDs
    const sent = await prisma.message.findMany({
        where: { senderId: userId },
        distinct: ["receiverId"],
        orderBy: { createdAt: "desc" },
        include: { receiver: { select: userPublic } },
    });
    const received = await prisma.message.findMany({
        where: { receiverId: userId },
        distinct: ["senderId"],
        orderBy: { createdAt: "desc" },
        include: { sender: { select: userPublic } },
    });

    // Merge unique partners
    const partnerMap = new Map<string, (typeof sent)[0]["receiver"] | (typeof received)[0]["sender"]>();
    for (const m of sent) partnerMap.set(m.receiver.id, m.receiver);
    for (const m of received) partnerMap.set(m.sender.id, m.sender);

    return Array.from(partnerMap.values());
}

export async function getMessages(userId: string, partnerId: string) {
    const messages = await prisma.message.findMany({
        where: {
            OR: [
                { senderId: userId, receiverId: partnerId },
                { senderId: partnerId, receiverId: userId },
            ],
        },
        include: { sender: { select: userPublic } },
        orderBy: { createdAt: "asc" },
        take: 100,
    });

    // Mark unread messages as read
    await prisma.message.updateMany({
        where: { senderId: partnerId, receiverId: userId, readAt: null },
        data: { readAt: new Date() },
    });

    return messages;
}

export async function sendMessage(senderId: string, dto: SendMessageDto) {
    const receiver = await prisma.user.findUnique({ where: { id: dto.receiverId } });
    if (!receiver) throw ApiError.notFound("Receiver not found");

    return prisma.message.create({
        data: { content: dto.content, senderId, receiverId: dto.receiverId },
        include: { sender: { select: userPublic } },
    });
}

// ─── Teachers list (for messaging) ───────────────────────────────────────────

export async function listTeachers() {
    const teacherRole = await prisma.role.findUnique({ where: { name: "TEACHER" } });
    if (!teacherRole) return [];
    return prisma.user.findMany({
        where: { roleId: teacherRole.id, isActive: true },
        select: userPublic,
        orderBy: { firstName: "asc" },
    });
}

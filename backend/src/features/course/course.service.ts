import { prisma } from '../../lib/prisma.js'
import { ApiError } from '../../lib/apiError.js'
import type {
    CreateCourseDto,
    UpdateCourseDto,
    CreateModuleDto,
    UpdateModuleDto,
    CreateLessonDto,
    UpdateLessonDto,
    CreateTestDto,
    CreateAssignmentDto,
    GradeSubmissionDto,
} from './course.schema.js'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function clean<T extends object>(obj: T): any {
    return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined))
}

// ─── Courses ──────────────────────────────────────────────────────────────────

export async function listCourses(authorId?: string) {
    return prisma.course.findMany({
        ...(authorId ? { where: { authorId } } : {}),
        orderBy: { updatedAt: 'desc' },
        include: {
            author: { select: { id: true, email: true, firstName: true, lastName: true } },
            _count: { select: { modules: true, enrollments: true } },
        },
    })
}

export async function getCourseById(id: string) {
    const course = await prisma.course.findUnique({
        where: { id },
        include: {
            author: { select: { id: true, email: true, firstName: true, lastName: true } },
            modules: {
                orderBy: { order: 'asc' },
                include: {
                    lessons: { orderBy: { order: 'asc' } },
                },
            },
            _count: { select: { enrollments: true } },
        },
    })
    if (!course) throw ApiError.notFound('Курс не найден')
    return course
}

export async function createCourse(authorId: string, dto: CreateCourseDto) {
    return prisma.course.create({
        data: { authorId, ...clean(dto) },
    })
}

export async function updateCourse(id: string, authorId: string, dto: UpdateCourseDto) {
    const course = await prisma.course.findUnique({ where: { id } })
    if (!course) throw ApiError.notFound('Курс не найден')
    if (course.authorId !== authorId) throw ApiError.forbidden('Нет прав на редактирование курса')
    return prisma.course.update({ where: { id }, data: clean(dto) })
}

export async function deleteCourse(id: string, authorId: string) {
    const course = await prisma.course.findUnique({ where: { id } })
    if (!course) throw ApiError.notFound('Курс не найден')
    if (course.authorId !== authorId) throw ApiError.forbidden('Нет прав')
    await prisma.course.delete({ where: { id } })
}

// ─── Modules ──────────────────────────────────────────────────────────────────

export async function createModule(courseId: string, authorId: string, dto: CreateModuleDto) {
    const course = await prisma.course.findUnique({ where: { id: courseId } })
    if (!course) throw ApiError.notFound('Курс не найден')
    if (course.authorId !== authorId) throw ApiError.forbidden('Нет прав')
    const count = await prisma.courseModule.count({ where: { courseId } })
    return prisma.courseModule.create({
        data: { courseId, title: dto.title, order: dto.order ?? count },
    })
}

export async function updateModule(moduleId: string, authorId: string, dto: UpdateModuleDto) {
    const mod = await prisma.courseModule.findUnique({ where: { id: moduleId }, include: { course: true } })
    if (!mod) throw ApiError.notFound('Модуль не найден')
    if (mod.course.authorId !== authorId) throw ApiError.forbidden('Нет прав')
    return prisma.courseModule.update({ where: { id: moduleId }, data: clean(dto) })
}

export async function deleteModule(moduleId: string, authorId: string) {
    const mod = await prisma.courseModule.findUnique({ where: { id: moduleId }, include: { course: true } })
    if (!mod) throw ApiError.notFound('Модуль не найден')
    if (mod.course.authorId !== authorId) throw ApiError.forbidden('Нет прав')
    await prisma.courseModule.delete({ where: { id: moduleId } })
}

export async function reorderModules(courseId: string, authorId: string, orderedIds: string[]) {
    const course = await prisma.course.findUnique({ where: { id: courseId } })
    if (!course) throw ApiError.notFound('Курс не найден')
    if (course.authorId !== authorId) throw ApiError.forbidden('Нет прав')
    await Promise.all(
        orderedIds.map((id, index) =>
            prisma.courseModule.update({ where: { id }, data: { order: index } })
        )
    )
    return prisma.courseModule.findMany({ where: { courseId }, orderBy: { order: 'asc' } })
}

// ─── Lessons ──────────────────────────────────────────────────────────────────

export async function createLesson(moduleId: string, authorId: string, dto: CreateLessonDto) {
    const mod = await prisma.courseModule.findUnique({ where: { id: moduleId }, include: { course: true } })
    if (!mod) throw ApiError.notFound('Модуль не найден')
    if (mod.course.authorId !== authorId) throw ApiError.forbidden('Нет прав')
    const count = await prisma.lesson.count({ where: { moduleId } })
    return prisma.lesson.create({
        data: clean({ moduleId, title: dto.title, type: dto.type, content: dto.content, videoUrl: dto.videoUrl, order: dto.order ?? count }),
    })
}

export async function updateLesson(lessonId: string, authorId: string, dto: UpdateLessonDto) {
    const lesson = await prisma.lesson.findUnique({ where: { id: lessonId }, include: { module: { include: { course: true } } } })
    if (!lesson) throw ApiError.notFound('Урок не найден')
    if (lesson.module.course.authorId !== authorId) throw ApiError.forbidden('Нет прав')
    return prisma.lesson.update({ where: { id: lessonId }, data: clean(dto) })
}

export async function deleteLesson(lessonId: string, authorId: string) {
    const lesson = await prisma.lesson.findUnique({ where: { id: lessonId }, include: { module: { include: { course: true } } } })
    if (!lesson) throw ApiError.notFound('Урок не найден')
    if (lesson.module.course.authorId !== authorId) throw ApiError.forbidden('Нет прав')
    await prisma.lesson.delete({ where: { id: lessonId } })
}

// ─── Tests ────────────────────────────────────────────────────────────────────

export async function upsertTest(lessonId: string, authorId: string, dto: CreateTestDto) {
    const lesson = await prisma.lesson.findUnique({ where: { id: lessonId }, include: { module: { include: { course: true } } } })
    if (!lesson) throw ApiError.notFound('Урок не найден')
    if (lesson.module.course.authorId !== authorId) throw ApiError.forbidden('Нет прав')

    // Delete existing test + questions if upsert
    const existing = await prisma.test.findUnique({ where: { lessonId } })
    if (existing) await prisma.test.delete({ where: { lessonId } })

    return prisma.test.create({
        data: {
            lessonId,
            title: dto.title,
            passingScore: dto.passingScore ?? 70,
            ...(dto.timeLimit !== undefined ? { timeLimit: dto.timeLimit } : {}),
            questions: {
                create: dto.questions.map((q, i) => ({
                    text: q.text,
                    type: q.type,
                    points: q.points ?? 1,
                    order: q.order ?? i,
                    ...(q.options ? { options: { create: q.options } } : {}),
                })),
            },
        },
        include: { questions: { include: { options: true } } },
    })
}

// ─── Assignments ──────────────────────────────────────────────────────────────

export async function upsertAssignment(lessonId: string, authorId: string, dto: CreateAssignmentDto) {
    const lesson = await prisma.lesson.findUnique({ where: { id: lessonId }, include: { module: { include: { course: true } } } })
    if (!lesson) throw ApiError.notFound('Урок не найден')
    if (lesson.module.course.authorId !== authorId) throw ApiError.forbidden('Нет прав')

    const data = clean({
        title: dto.title,
        description: dto.description,
        maxScore: dto.maxScore ?? 100,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
    })

    const existing = await prisma.assignment.findUnique({ where: { lessonId } })
    if (existing) {
        return prisma.assignment.update({ where: { lessonId }, data })
    }
    return prisma.assignment.create({ data: { lessonId, ...data } })
}

export async function listSubmissions(assignmentId: string, authorId: string) {
    const assignment = await prisma.assignment.findUnique({
        where: { id: assignmentId },
        include: { lesson: { include: { module: { include: { course: true } } } } },
    })
    if (!assignment) throw ApiError.notFound('Задание не найдено')
    if (assignment.lesson.module.course.authorId !== authorId) throw ApiError.forbidden('Нет прав')
    return prisma.assignmentSubmission.findMany({
        where: { assignmentId },
        include: { student: { select: { id: true, email: true, firstName: true, lastName: true } } },
        orderBy: { submittedAt: 'desc' },
    })
}

export async function gradeSubmission(submissionId: string, authorId: string, dto: GradeSubmissionDto) {
    const sub = await prisma.assignmentSubmission.findUnique({
        where: { id: submissionId },
        include: { assignment: { include: { lesson: { include: { module: { include: { course: true } } } } } } },
    })
    if (!sub) throw ApiError.notFound('Работа не найдена')
    if (sub.assignment.lesson.module.course.authorId !== authorId) throw ApiError.forbidden('Нет прав')
    return prisma.assignmentSubmission.update({
        where: { id: submissionId },
        data: clean({ score: dto.score, feedback: dto.feedback, gradedAt: new Date() }),
    })
}

// ─── Teacher stats ────────────────────────────────────────────────────────────

export async function getTeacherStats(authorId: string) {
    const [totalCourses, totalStudents, pendingSubmissions] = await Promise.all([
        prisma.course.count({ where: { authorId } }),
        prisma.enrollment.count({
            where: { course: { authorId } },
        }),
        prisma.assignmentSubmission.count({
            where: { score: null, assignment: { lesson: { module: { course: { authorId } } } } },
        }),
    ])
    return { totalCourses, totalStudents, pendingSubmissions }
}

import bcrypt from "bcrypt";
import { PrismaClient, RoleName } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const baseRoles: RoleName[] = [
        RoleName.INSTITUTION_ADMIN,
        RoleName.TEACHER,
        RoleName.STUDENT,
        RoleName.PARENT,
    ];

    for (const roleName of baseRoles) {
        await prisma.role.upsert({
            where: { name: roleName },
            update: {},
            create: { name: roleName },
        });
    }

    const [adminRole, teacherRole, studentRole, parentRole] = await Promise.all([
        prisma.role.findUniqueOrThrow({ where: { name: RoleName.INSTITUTION_ADMIN } }),
        prisma.role.findUniqueOrThrow({ where: { name: RoleName.TEACHER } }),
        prisma.role.findUniqueOrThrow({ where: { name: RoleName.STUDENT } }),
        prisma.role.findUniqueOrThrow({ where: { name: RoleName.PARENT } }),
    ]);

    const hash = await bcrypt.hash("Password123!", 10);

    const admin = await prisma.user.upsert({
        where: { email: "admin@edufuture.local" },
        update: { roleId: adminRole.id, passwordHash: hash, firstName: "Admin", lastName: "System" },
        create: {
            email: "admin@edufuture.local",
            passwordHash: hash,
            firstName: "Admin",
            lastName: "System",
            roleId: adminRole.id,
        },
    });

    const teacher = await prisma.user.upsert({
        where: { email: "teacher@edufuture.local" },
        update: { roleId: teacherRole.id, passwordHash: hash, firstName: "Elena", lastName: "Teacher" },
        create: {
            email: "teacher@edufuture.local",
            passwordHash: hash,
            firstName: "Elena",
            lastName: "Teacher",
            roleId: teacherRole.id,
        },
    });

    const student = await prisma.user.upsert({
        where: { email: "student@edufuture.local" },
        update: { roleId: studentRole.id, passwordHash: hash, firstName: "Ivan", lastName: "Student" },
        create: {
            email: "student@edufuture.local",
            passwordHash: hash,
            firstName: "Ivan",
            lastName: "Student",
            roleId: studentRole.id,
        },
    });

    const parent = await prisma.user.upsert({
        where: { email: "parent@edufuture.local" },
        update: { roleId: parentRole.id, passwordHash: hash, firstName: "Olga", lastName: "Parent" },
        create: {
            email: "parent@edufuture.local",
            passwordHash: hash,
            firstName: "Olga",
            lastName: "Parent",
            roleId: parentRole.id,
        },
    });

    const course = await prisma.course.upsert({
        where: { id: "seed-course-paid" },
        update: {
            title: "Data Literacy Basics",
            description: "Paid sample course for checkout and marketplace flows",
            status: "PUBLISHED",
            isPaid: true,
            priceCents: 1990,
            currency: "USD",
            authorId: teacher.id,
        },
        create: {
            id: "seed-course-paid",
            title: "Data Literacy Basics",
            description: "Paid sample course for checkout and marketplace flows",
            status: "PUBLISHED",
            isPaid: true,
            priceCents: 1990,
            currency: "USD",
            authorId: teacher.id,
        },
    });

    const moduleCount = await prisma.courseModule.count({ where: { courseId: course.id } });
    if (moduleCount === 0) {
        const moduleItem = await prisma.courseModule.create({
            data: {
                title: "Intro module",
                courseId: course.id,
                order: 0,
            },
        });
        await prisma.lesson.createMany({
            data: [
                {
                    title: "Why data matters",
                    type: "TEXT",
                    moduleId: moduleItem.id,
                    order: 0,
                    content: "Introduction lesson",
                },
                {
                    title: "Simple charts",
                    type: "VIDEO",
                    moduleId: moduleItem.id,
                    order: 1,
                    videoUrl: "https://example.com/video",
                },
            ],
        });
    }

    await prisma.parentStudent.upsert({
        where: { parentId_studentId: { parentId: parent.id, studentId: student.id } },
        update: {},
        create: { parentId: parent.id, studentId: student.id },
    });

    await prisma.gamificationProfile.upsert({
        where: { userId: student.id },
        update: { xp: 220, level: 3, streak: 5 },
        create: { userId: student.id, xp: 220, level: 3, streak: 5 },
    });

    await prisma.subscriptionPlan.upsert({
        where: { id: "seed-plan-monthly" },
        update: {
            name: "School Basic",
            description: "Seed subscription plan",
            priceCents: 990,
            currency: "USD",
            interval: "MONTHLY",
            isActive: true,
        },
        create: {
            id: "seed-plan-monthly",
            name: "School Basic",
            description: "Seed subscription plan",
            priceCents: 990,
            currency: "USD",
            interval: "MONTHLY",
            isActive: true,
        },
    });

    await prisma.subscription.upsert({
        where: { id: "seed-sub-admin" },
        update: {
            userId: admin.id,
            planId: "seed-plan-monthly",
            status: "ACTIVE",
            currentPeriodStart: new Date(),
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
        create: {
            id: "seed-sub-admin",
            userId: admin.id,
            planId: "seed-plan-monthly",
            status: "ACTIVE",
            currentPeriodStart: new Date(),
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
    });
}

main()
    .then(async () => {
        await prisma.$disconnect();
        console.log("Seed completed: roles, demo users, sample course, subscription data");
    })
    .catch(async (error) => {
        await prisma.$disconnect();
        console.error(error);
        process.exit(1);
    });

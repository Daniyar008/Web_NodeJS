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
}

main()
    .then(async () => {
        await prisma.$disconnect();
        console.log("Seed completed: roles created/updated");
    })
    .catch(async (error) => {
        await prisma.$disconnect();
        console.error(error);
        process.exit(1);
    });

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    const baseRoles = [
        client_1.RoleName.INSTITUTION_ADMIN,
        client_1.RoleName.TEACHER,
        client_1.RoleName.STUDENT,
        client_1.RoleName.PARENT,
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
//# sourceMappingURL=seed.js.map
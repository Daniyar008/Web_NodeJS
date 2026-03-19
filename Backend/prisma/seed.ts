import { PrismaClient, Role, InstitutionType, SubscriptionPlan } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting DB seeding...');

  // Create Super Admin
  const hashedAdminPassword = await bcrypt.hash('admin123!', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@edufuture.com' },
    update: {},
    create: {
      email: 'admin@edufuture.com',
      firstName: 'System',
      lastName: 'Admin',
      password: hashedAdminPassword,
      role: Role.SUPER_ADMIN,
    },
  });

  // Create Institution
  const school = await prisma.institution.create({
    data: {
      name: 'Global Horizons Academy',
      type: InstitutionType.SCHOOL,
      subscription: SubscriptionPlan.PROFESSIONAL,
    }
  });

  console.log('Seeding complete. Admin created with ID:', admin.id);
  console.log('School created with ID:', school.id);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('helios@admin2026', 10);
  const user = await prisma.adminUser.upsert({
    where: { email: 'admin@heliosevent.co' },
    update: {},
    create: { name: 'Admin', email: 'admin@heliosevent.co', password, role: 'SUPER_ADMIN' },
  });
  console.log('Admin user ready:', user.email);
}

main().then(() => prisma.$disconnect()).catch(e => { console.error(e); prisma.$disconnect(); process.exit(1); });

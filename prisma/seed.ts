require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const pg = require('pg');

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const services = [
    { name: 'Visa Application', prefix: 'V' },
    { name: 'Passport Services', prefix: 'P' },
    { name: 'Document Legalization', prefix: 'L' },
    { name: 'Consular Assistance', prefix: 'C' },
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { prefix: service.prefix },
      update: {},
      create: {
        name: service.name,
        prefix: service.prefix,
      },
    });
  }

  console.log('Seed completed: Services created.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

export {};

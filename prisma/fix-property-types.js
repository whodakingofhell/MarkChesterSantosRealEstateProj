const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient();

  const updates = [
    { title: 'Modern Condo Unit in BGC', type: 'CONDOMINIUM' },
    { title: 'Spacious Family Home in Quezon City', type: 'HOUSE_AND_LOT' },
  ];

  for (const u of updates) {
    const result = await prisma.property.updateMany({
      where: { title: u.title },
      data: { propertyType: u.type },
    });
    console.log(`Updated "${u.title}" → ${u.type} (${result.count} rows)`);
  }

  const all = await prisma.property.findMany({ select: { title: true, propertyType: true, status: true } });
  console.log('\nAll properties:');
  all.forEach(p => console.log(`  ${p.propertyType.padEnd(16)} | ${p.status.padEnd(10)} | ${p.title}`));

  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });

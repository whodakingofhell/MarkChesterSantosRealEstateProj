const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient();

  try {
    // Count properties before deletion
    const countBefore = await prisma.property.count();
    console.log(`Found ${countBefore} properties in the database.`);

    if (countBefore === 0) {
      console.log('No properties to delete.');
      await prisma.$disconnect();
      return;
    }

    // Delete all properties (this will also cascade-delete related
    // Transactions and Appraisals due to foreign key constraints)
    const result = await prisma.property.deleteMany({});
    console.log(`Deleted ${result.count} properties.`);

    // Verify deletion
    const countAfter = await prisma.property.count();
    console.log(`Properties remaining: ${countAfter}`);

    // Verify users are untouched
    const userCount = await prisma.user.count();
    console.log(`Users remaining (untouched): ${userCount}`);

    console.log('Done!');
  } catch (error) {
    console.error('Error deleting properties:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();

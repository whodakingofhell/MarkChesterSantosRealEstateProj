const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const testPassword = process.env.SEED_TEST_PASSWORD || 'Test@2026!';
const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'Admin@2026!';

const accounts = [
  {
    email: 'maria@test.com',
    password: testPassword,
    name: 'Maria Santos',
    role: 'CLIENT',
    profile: {
      phone: '+63 917 123 4567',
      address: 'BGC, Taguig City',
    },
  },
  {
    email: 'juan@test.com',
    password: testPassword,
    name: 'Juan Dela Cruz',
    role: 'CLIENT',
    profile: {
      phone: '+63 960 987 6543',
      address: 'Makati City, Metro Manila',
    },
  },
  {
    email: 'roberto@test.com',
    password: testPassword,
    name: 'Roberto Reyes',
    role: 'APPRAISER',
    profile: {
      licenseNumber: 'APP-002-2024',
      licenseExpiry: new Date('2027-01-01'),
      specializations: JSON.stringify(['RESIDENTIAL', 'COMMERCIAL']),
      yearsExperience: 8,
      slug: 'roberto-reyes',
      averageRating: 4.5,
      totalReviews: 12,
    },
  },
  {
    email: 'admin@philippineskyland.com',
    password: adminPassword,
    name: 'Admin User',
    role: 'ADMIN',
    profile: null,
  },
];

async function seed() {
  for (const account of accounts) {
    const existing = await prisma.user.findUnique({
      where: { email: account.email },
    });

    if (existing) {
      console.log(`[SKIP] ${account.email} already exists`);
      continue;
    }

    const passwordHash = await bcrypt.hash(account.password, 12);

    const user = await prisma.user.create({
      data: {
        email: account.email,
        passwordHash,
        name: account.name,
        role: account.role,
        isVerified: true,
      },
    });

    if (account.role === 'CLIENT' && account.profile) {
      await prisma.clientProfile.create({
        data: {
          userId: user.id,
          phone: account.profile.phone,
          address: account.profile.address,
        },
      });
    }

    if (account.role === 'APPRAISER' && account.profile) {
      await prisma.appraiserProfile.create({
        data: {
          userId: user.id,
          licenseNumber: account.profile.licenseNumber,
          licenseExpiry: account.profile.licenseExpiry,
          specializations: account.profile.specializations,
          yearsExperience: account.profile.yearsExperience,
          slug: account.profile.slug,
          averageRating: account.profile.averageRating,
          totalReviews: account.profile.totalReviews,
        },
      });
    }

    console.log(`[CREATED] ${account.email} (${account.role})`);
  }

  await prisma.$disconnect();
}

seed().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});

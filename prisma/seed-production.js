const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

async function main() {
  const prisma = new PrismaClient();

  const passwordHash = await bcrypt.hash('Nelson@2026!', 12);

  const user = await prisma.user.upsert({
    where: { email: 'nelsonaczon@gmail.com' },
    update: {},
    create: {
      email: 'nelsonaczon@gmail.com',
      passwordHash,
      name: 'Nelson Aczon',
      role: 'BROKER',
      isVerified: true,
      isActive: true,
    },
  });
  console.log('User created:', user.id);

  const broker = await prisma.brokerProfile.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      licenseNumber: 'REA-001-2024',
      licenseExpiry: new Date('2028-12-31'),
      specializations: JSON.stringify(['Residential', 'Commercial', 'Land', 'Industrial']),
      yearsExperience: 10,
      bio: 'Licensed Real Estate Broker and Appraiser with over 10 years of experience in the Philippine real estate market. Specializing in residential, commercial, and industrial properties across Metro Manila and surrounding areas. Committed to providing professional, ethical, and results-driven real estate services.',
      photo: '/images/nelson-aczon.jpg',
      socialMedia: JSON.stringify({
        facebook: 'https://facebook.com/nelsonaczon',
        instagram: 'https://instagram.com/nelsonaczon',
        linkedin: 'https://linkedin.com/in/nelsonaczon',
      }),
      contactInfo: JSON.stringify({
        phone: '+639174722107',
        whatsapp: '+639174722107',
        viber: '+639174722107',
        email: 'nelsonaczon@gmail.com',
      }),
      slug: 'nelson-aczon',
      isVerified: true,
      averageRating: 4.8,
      totalReviews: 25,
    },
  });
  console.log('Broker profile created:', broker.id);

  const properties = [
    {
      brokerId: broker.id,
      title: 'Modern Condo Unit in BGC',
      description: 'Beautiful modern condominium unit in Bonifacio Global City. Features floor-to-ceiling windows, premium finishes, and world-class amenities including infinity pool, gym, and 24/7 security. Perfect for professionals looking for urban luxury living.',
      propertyType: 'RESIDENTIAL',
      price: 12500000,
      lotArea: 65,
      floorArea: 55,
      bedrooms: 2,
      bathrooms: 2,
      carGarage: 1,
      address: '26th Street, Bonifacio Global City',
      city: 'Taguig',
      province: 'Metro Manila',
      latitude: 14.5547,
      longitude: 121.0500,
      features: JSON.stringify(['Swimming Pool', 'Gym', '24/7 Security', 'Concierge', 'Parking']),
      images: JSON.stringify(['/images/properties/bgc-condo.jpg']),
      status: 'ACTIVE',
    },
    {
      brokerId: broker.id,
      title: 'Spacious Family Home in Quezon City',
      description: 'Large 4-bedroom family home in a quiet subdivision in Quezon City. Features a spacious yard, modern kitchen, and proximity to top schools, malls, and hospitals. Ideal for growing families seeking comfort and convenience.',
      propertyType: 'RESIDENTIAL',
      price: 18000000,
      lotArea: 200,
      floorArea: 180,
      bedrooms: 4,
      bathrooms: 3,
      carGarage: 2,
      address: 'New Manila, Quezon City',
      city: 'Quezon City',
      province: 'Metro Manila',
      latitude: 14.6211,
      longitude: 121.0225,
      features: JSON.stringify(['Garden', 'Modern Kitchen', 'Near Schools', 'Near Hospital', 'Garage']),
      images: JSON.stringify(['/images/properties/qc-home.jpg']),
      status: 'ACTIVE',
    },
    {
      brokerId: broker.id,
      title: 'Commercial Lot in Makati CBD',
      description: 'Prime commercial lot in Makati Central Business District. Excellent location for office buildings, retail spaces, or mixed-use developments. High foot traffic area with excellent accessibility via MRT and major roads.',
      propertyType: 'COMMERCIAL',
      price: 85000000,
      lotArea: 500,
      address: 'Ayala Avenue, Makati City',
      city: 'Makati',
      province: 'Metro Manila',
      latitude: 14.5547,
      longitude: 121.0230,
      features: JSON.stringify(['Prime Location', 'Near MRT', 'High Foot Traffic', 'Commercial Zone']),
      images: JSON.stringify(['/images/properties/makati-lot.jpg']),
      status: 'ACTIVE',
    },
  ];

  for (const prop of properties) {
    const existing = await prisma.property.findFirst({
      where: { title: prop.title, brokerId: broker.id },
    });
    if (!existing) {
      await prisma.property.create({ data: prop });
      console.log('Property created:', prop.title);
    } else {
      console.log('Property exists:', prop.title);
    }
  }

  console.log('Seed complete!');
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });

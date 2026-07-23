const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

async function main() {
  const prisma = new PrismaClient();

  const password = process.env.SEED_ADMIN_PASSWORD;
  if (!password) {
    console.error('ERROR: SEED_ADMIN_PASSWORD environment variable is required');
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 12);

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
      propertyType: 'CONDOMINIUM',
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
      propertyType: 'HOUSE_AND_LOT',
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
      title: 'Prime Commercial Lot in Makati CBD',
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
    {
      brokerId: broker.id,
      title: 'Beachfront Lot in Batangas',
      description: 'Stunning beachfront lot with pristine white sand and crystal-clear waters. Perfect for a vacation home, resort development, or investment property. Direct beach access with breathtaking ocean views.',
      propertyType: 'BEACHFRONT',
      price: 5500000,
      lotArea: 500,
      address: 'Laiya, Batangas',
      city: 'San Juan',
      province: 'Batangas',
      latitude: 13.7500,
      longitude: 121.4000,
      features: JSON.stringify(['Beachfront', 'Ocean View', 'White Sand', 'Direct Access']),
      images: JSON.stringify(['/images/properties/batangas-beach.jpg']),
      status: 'ACTIVE',
    },
    {
      brokerId: broker.id,
      title: 'Residential Lot in Cavite',
      description: 'Affordable residential lot in a gated community in Cavite. Near Tagaytay and Aguinaldo Highway. Ideal for building your dream home with access to modern amenities and easy commute to Metro Manila.',
      propertyType: 'LOT_ONLY',
      price: 2800000,
      lotArea: 300,
      address: 'Amadeo, Cavite',
      city: 'Amadeo',
      province: 'Cavite',
      latitude: 14.1680,
      longitude: 120.9260,
      features: JSON.stringify(['Gated Community', 'Near Tagaytay', 'Flood Free', 'Road Access']),
      images: JSON.stringify(['/images/properties/cavite-lot.jpg']),
      status: 'ACTIVE',
    },
    {
      brokerId: broker.id,
      title: 'Farm Lot in Laguna',
      description: 'Expansive farm lot surrounded by lush greenery in Laguna. Perfect for organic farming, agri-tourism, or a countryside retreat. Has natural water source and accessible via national highway.',
      propertyType: 'FARM_LOT',
      price: 4200000,
      lotArea: 5000,
      address: 'Bay, Laguna',
      city: 'Bay',
      province: 'Laguna',
      latitude: 14.1830,
      longitude: 121.1830,
      features: JSON.stringify(['Natural Water Source', 'Highway Access', 'Fertile Soil', 'Mountain View']),
      images: JSON.stringify(['/images/properties/laguna-farm.jpg']),
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

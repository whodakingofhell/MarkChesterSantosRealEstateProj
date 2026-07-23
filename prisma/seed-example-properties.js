const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const exampleProperties = [
  {
    title: 'Modern 3-Bedroom House and Lot in BGC',
    description: 'Beautiful modern home in the heart of Bonifacio Global City. This stunning 3-bedroom, 2-bathroom house features an open floor plan, floor-to-ceiling windows, and premium finishes throughout. The property includes a private garage, landscaped garden, and access to world-class amenities including swimming pool, gym, and 24/7 security. Walking distance to SM Aura, Market Market, and major corporate offices.',
    propertyType: 'HOUSE_AND_LOT',
    status: 'ACTIVE',
    price: 28500000,
    lotArea: 200,
    floorArea: 180,
    bedrooms: 3,
    bathrooms: 2,
    carGarage: 2,
    address: '56 26th Street, Bonifacio Global City',
    city: 'Taguig',
    province: 'Metro Manila',
    latitude: 14.5547,
    longitude: 121.0500,
    features: JSON.stringify([
      'Open Floor Plan',
      'Floor-to-Ceiling Windows',
      'Modular Kitchen',
      'Private Garage',
      'Landscaped Garden',
      'Swimming Pool Access',
      '24/7 Security',
      'Near SM Aura',
      'Near Corporate Offices',
    ]),
    images: JSON.stringify([]),
    documents: JSON.stringify([]),
  },
  {
    title: 'Beachfront Lot in Laiya, Batangas',
    description: 'Prime beachfront lot perfect for building your dream vacation home or boutique resort. This 500 sqm property offers direct access to the pristine white sand beaches of Laiya. Surrounded by coconut trees and overlooking the crystal-clear waters of Batangas Bay. Ideal for investors looking for beachfront real estate in one of the most popular beach destinations south of Manila. Only 2.5 hours from Metro Manila via SLEX.',
    propertyType: 'BEACHFRONT',
    status: 'ACTIVE',
    price: 12000000,
    lotArea: 500,
    bedrooms: null,
    bathrooms: null,
    carGarage: null,
    address: 'Laiya-Apbuy Road, Sitio Libjo',
    city: 'San Juan',
    province: 'Batangas',
    latitude: 13.7333,
    longitude: 121.4167,
    features: JSON.stringify([
      'Beachfront',
      'White Sand Beach',
      'Coconut Trees',
      'Bay View',
      'Near Tourist Spots',
      'Accessible via SLEX',
      'Electricity Available',
      'Water Source Available',
    ]),
    images: JSON.stringify([]),
    documents: JSON.stringify([]),
  },
  {
    title: 'Commercial Space in Makati CBD',
    description: 'Prime commercial space available for lease in the Makati Central Business District. This 120 sqm ground-floor unit is perfect for retail, restaurant, or professional office use. Located along Ayala Avenue with high foot traffic and excellent visibility. Building features modern amenities, centralized air conditioning, and dedicated parking. Surrounded by major banks, hotels, and corporate headquarters.',
    propertyType: 'COMMERCIAL',
    status: 'ACTIVE',
    price: 85000,
    lotArea: null,
    floorArea: 120,
    bedrooms: null,
    bathrooms: 2,
    carGarage: 3,
    address: '123 Ayala Avenue, Legazpi Village',
    city: 'Makati',
    province: 'Metro Manila',
    latitude: 14.5547,
    longitude: 121.0194,
    features: JSON.stringify([
      'Ground Floor',
      'High Foot Traffic',
      'Centralized AC',
      'Dedicated Parking',
      'Near Ayala Center',
      '24/7 Security',
      'Elevator Access',
      'Fiber Internet Ready',
    ]),
    images: JSON.stringify([]),
    documents: JSON.stringify([]),
  },
];

async function seedProperties() {
  try {
    const nelsonUser = await prisma.user.findUnique({
      where: { email: 'nelsonaczon@gmail.com' },
      select: { id: true, brokerProfile: { select: { id: true } } },
    });

    if (!nelsonUser) {
      console.error('ERROR: Nelson Aczon account not found in database');
      process.exit(1);
    }

    if (!nelsonUser.brokerProfile) {
      console.error('ERROR: Nelson Aczon does not have a broker profile');
      process.exit(1);
    }

    const brokerId = nelsonUser.brokerProfile.id;
    let created = 0;

    for (const property of exampleProperties) {
      const existing = await prisma.property.findFirst({
        where: { title: property.title },
      });

      if (existing) {
        console.log(`[SKIP] Property already exists: ${property.title}`);
        continue;
      }

      await prisma.property.create({
        data: {
          ...property,
          brokerId,
        },
      });
      console.log(`[CREATED] ${property.title} - ₱${property.price.toLocaleString()}`);
      created++;
    }

    console.log(`\nDone! Created ${created} properties. ${3 - created} already existed.`);
  } catch (error) {
    console.error('Failed to seed properties:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedProperties();

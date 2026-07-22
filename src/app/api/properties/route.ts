import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { searchSchema } from '@/lib/validation';
import { prisma } from '@/lib/prisma';
import { logError } from '@/lib/logger';
import { apiLimiter } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

const safeUserSelect = { id: true, email: true, name: true, role: true };

export async function GET(request: NextRequest) {
  const rateLimited = await apiLimiter(request);
  if (rateLimited) return rateLimited;
  try {
    const { searchParams } = new URL(request.url);
    
    const searchData = {
      query: searchParams.get('query') || undefined,
      propertyType: searchParams.get('propertyType') || undefined,
      status: searchParams.get('status') || undefined,
      minPrice: searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined,
      maxPrice: searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined,
      minLotArea: searchParams.get('minLotArea') ? parseFloat(searchParams.get('minLotArea')!) : undefined,
      maxLotArea: searchParams.get('maxLotArea') ? parseFloat(searchParams.get('maxLotArea')!) : undefined,
      minFloorArea: searchParams.get('minFloorArea') ? parseFloat(searchParams.get('minFloorArea')!) : undefined,
      maxFloorArea: searchParams.get('maxFloorArea') ? parseFloat(searchParams.get('maxFloorArea')!) : undefined,
      bedrooms: searchParams.get('bedrooms') ? parseInt(searchParams.get('bedrooms')!) : undefined,
      bathrooms: searchParams.get('bathrooms') ? parseInt(searchParams.get('bathrooms')!) : undefined,
      city: searchParams.get('city') || undefined,
      province: searchParams.get('province') || undefined,
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '20'),
    };
    
    const validation = searchSchema.safeParse(searchData);
    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid search parameters' }, { status: 400 });
    }
    
    const filters = validation.data;
    const where: any = {};
    
    if (filters.status) {
      where.status = filters.status;
    } else {
      where.status = 'ACTIVE';
    }
    
    if (filters.query) {
      where.OR = [
        { title: { contains: filters.query, mode: 'insensitive' } },
        { description: { contains: filters.query, mode: 'insensitive' } },
        { address: { contains: filters.query, mode: 'insensitive' } },
        { city: { contains: filters.query, mode: 'insensitive' } },
      ];
    }
    
    if (filters.propertyType) where.propertyType = filters.propertyType;
    
    if (filters.minPrice || filters.maxPrice) {
      where.price = {};
      if (filters.minPrice) where.price.gte = filters.minPrice;
      if (filters.maxPrice) where.price.lte = filters.maxPrice;
    }
    
    if (filters.minLotArea || filters.maxLotArea) {
      where.lotArea = {};
      if (filters.minLotArea) where.lotArea.gte = filters.minLotArea;
      if (filters.maxLotArea) where.lotArea.lte = filters.maxLotArea;
    }
    
    if (filters.minFloorArea || filters.maxFloorArea) {
      where.floorArea = {};
      if (filters.minFloorArea) where.floorArea.gte = filters.minFloorArea;
      if (filters.maxFloorArea) where.floorArea.lte = filters.maxFloorArea;
    }
    
    if (filters.city) where.city = { contains: filters.city, mode: 'insensitive' };
    if (filters.province) where.province = { contains: filters.province, mode: 'insensitive' };
    if (filters.bedrooms) where.bedrooms = { gte: filters.bedrooms };
    if (filters.bathrooms) where.bathrooms = { gte: filters.bathrooms };
    
    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where,
        include: { broker: { include: { user: { select: safeUserSelect } } } },
        skip: (filters.page - 1) * filters.limit,
        take: filters.limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.property.count({ where }),
    ]);
    
    return NextResponse.json({
      success: true,
      data: properties,
      pagination: {
        page: filters.page,
        limit: filters.limit,
        total,
        totalPages: Math.ceil(total / filters.limit),
      },
    });
    
  } catch (error) {
    logError('Failed to fetch properties', { error: String(error) });
    return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const rateLimited = await apiLimiter(request);
  if (rateLimited) return rateLimited;

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    if ((session.user as any).role !== 'BROKER' && (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    const body = await request.json();
    
    const brokerProfile = await prisma.brokerProfile.findUnique({
      where: { userId: (session.user as any).id },
    });
    
    if (!brokerProfile) {
      return NextResponse.json({ error: 'Broker profile not found' }, { status: 404 });
    }
    
    const property = await prisma.property.create({
      data: {
        brokerId: brokerProfile.id,
        title: body.title,
        description: body.description,
        propertyType: body.propertyType,
        price: body.price,
        lotArea: body.lotArea,
        floorArea: body.floorArea,
        bedrooms: body.bedrooms,
        bathrooms: body.bathrooms,
        carGarage: body.carGarage,
        address: body.address,
        city: body.city,
        province: body.province,
        latitude: body.latitude,
        longitude: body.longitude,
        features: JSON.stringify(body.features || []),
        images: JSON.stringify(body.images || []),
      },
      include: { broker: { include: { user: { select: safeUserSelect } } } },
    });
    
    return NextResponse.json({ success: true, data: property });
    
  } catch (error) {
    logError('Failed to create property', { error: String(error) });
    return NextResponse.json({ error: 'Failed to create property' }, { status: 500 });
  }
}

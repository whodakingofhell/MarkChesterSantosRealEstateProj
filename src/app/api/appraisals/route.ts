import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { logError } from '@/lib/logger';
import { apiLimiter } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const rateLimited = await apiLimiter(request);
  if (rateLimited) return rateLimited;
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');
    
    const where: any = {};
    const userRole = (session.user as any).role;
    
    if (userRole === 'APPRAISER') where.appraiser = { userId: (session.user as any).id };
    if (status) where.status = status;
    
    const [appraisals, total] = await Promise.all([
      prisma.appraisal.findMany({
        where,
        include: {
          property: true,
          appraiser: { include: { user: { select: { id: true, email: true, name: true, role: true, isVerified: true, isActive: true, createdAt: true, updatedAt: true } } } },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.appraisal.count({ where }),
    ]);
    
    return NextResponse.json({
      success: true,
      data: appraisals,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
    
  } catch (error) {
    logError('Failed to fetch appraisals', { error: String(error) });
    return NextResponse.json({ error: 'Failed to fetch appraisals' }, { status: 500 });
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
    
    const userRole = (session.user as any).role;
    if (userRole !== 'APPRAISER' && userRole !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    const body = await request.json();
    
    const appraiserProfile = await prisma.appraiserProfile.findUnique({
      where: { userId: (session.user as any).id },
    });
    
    if (!appraiserProfile) {
      return NextResponse.json({ error: 'Appraiser profile not found' }, { status: 404 });
    }
    
    const appraisal = await prisma.appraisal.create({
      data: {
        propertyId: body.propertyId,
        appraiserId: appraiserProfile.id,
        scheduledDate: body.scheduledDate ? new Date(body.scheduledDate) : null,
        notes: body.notes,
      },
      include: {
        property: true,
        appraiser: { include: { user: true } },
      },
    });
    
    return NextResponse.json({ success: true, data: appraisal });
    
  } catch (error) {
    logError('Failed to create appraisal', { error: String(error) });
    return NextResponse.json({ error: 'Failed to create appraisal' }, { status: 500 });
  }
}

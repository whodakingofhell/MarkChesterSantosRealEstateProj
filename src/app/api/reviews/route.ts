import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logError } from '@/lib/logger';
import { apiLimiter } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const rateLimited = await apiLimiter(request);
  if (rateLimited) return rateLimited;
  try {
    const { searchParams } = new URL(request.url);
    const professionalId = searchParams.get('professionalId');
    const professionalType = searchParams.get('professionalType');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    
    if (!professionalId || !professionalType) {
      return NextResponse.json(
        { error: 'Professional ID and type are required' },
        { status: 400 }
      );
    }
    
    const where: any = { isVerified: true };
    if (professionalType === 'broker') where.brokerId = professionalId;
    else if (professionalType === 'appraiser') where.appraiserId = professionalId;
    
    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.review.count({ where }),
    ]);
    
    return NextResponse.json({
      success: true,
      data: reviews,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
    
  } catch (error) {
    logError('Failed to fetch reviews', { error: String(error) });
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const rateLimited = await apiLimiter(request);
  if (rateLimited) return rateLimited;

  try {
    const body = await request.json();
    
    const review = await prisma.review.create({
      data: {
        brokerId: body.professionalType === 'broker' ? body.professionalId : null,
        appraiserId: body.professionalType === 'appraiser' ? body.professionalId : null,
        clientName: body.clientName,
        clientEmail: body.clientEmail,
        rating: body.rating,
        comment: body.comment,
      },
    });
    
    const reviews = await prisma.review.findMany({
      where: body.professionalType === 'broker'
        ? { brokerId: body.professionalId }
        : { appraiserId: body.professionalId },
    });
    
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    
    if (body.professionalType === 'broker') {
      await prisma.brokerProfile.update({
        where: { id: body.professionalId },
        data: { averageRating: avgRating, totalReviews: reviews.length },
      });
    } else {
      await prisma.appraiserProfile.update({
        where: { id: body.professionalId },
        data: { averageRating: avgRating, totalReviews: reviews.length },
      });
    }
    
    return NextResponse.json({ success: true, data: review });
    
  } catch (error) {
    logError('Failed to create review', { error: String(error) });
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 });
  }
}

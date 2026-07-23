import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { logError } from '@/lib/logger';
import { apiLimiter } from '@/lib/rate-limit';
import { reviewSchema } from '@/lib/validation';

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
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'You must be signed in to submit a review' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    const validation = reviewSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input provided' },
        { status: 400 }
      );
    }
    
    const validatedData = validation.data;

    const professional = validatedData.professionalType === 'broker'
      ? await prisma.brokerProfile.findUnique({ where: { id: validatedData.professionalId } })
      : await prisma.appraiserProfile.findUnique({ where: { id: validatedData.professionalId } });

    if (!professional) {
      return NextResponse.json({ error: 'Professional not found' }, { status: 404 });
    }
    
    const review = await prisma.review.create({
      data: {
        brokerId: validatedData.professionalType === 'broker' ? validatedData.professionalId : null,
        appraiserId: validatedData.professionalType === 'appraiser' ? validatedData.professionalId : null,
        clientName: (session.user as any).name || validatedData.clientName,
        clientEmail: (session.user as any).email || validatedData.clientEmail,
        rating: validatedData.rating,
        comment: validatedData.comment,
      },
    });
    
    const reviews = await prisma.review.findMany({
      where: validatedData.professionalType === 'broker'
        ? { brokerId: validatedData.professionalId }
        : { appraiserId: validatedData.professionalId },
    });
    
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    
    if (validatedData.professionalType === 'broker') {
      await prisma.brokerProfile.update({
        where: { id: validatedData.professionalId },
        data: { averageRating: avgRating, totalReviews: reviews.length },
      });
    } else {
      await prisma.appraiserProfile.update({
        where: { id: validatedData.professionalId },
        data: { averageRating: avgRating, totalReviews: reviews.length },
      });
    }
    
    return NextResponse.json({ success: true, data: review });
    
  } catch (error) {
    logError('Failed to create review', { error: String(error) });
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 });
  }
}

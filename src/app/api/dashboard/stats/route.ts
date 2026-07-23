import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
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

    const userId = (session.user as any).id;
    const role = (session.user as any).role;

    let propertyCount = 0;
    let totalRevenue = 0;
    let inquiryCount = 0;
    let averageRating = 0;

    if (role === 'BROKER') {
      const brokerProfile = await prisma.brokerProfile.findUnique({
        where: { userId },
        select: {
          id: true,
          averageRating: true,
          properties: {
            select: { id: true, price: true, status: true },
          },
          transactions: {
            select: { id: true, amount: true, status: true },
          },
        },
      });

      if (brokerProfile) {
        propertyCount = brokerProfile.properties.length;
        totalRevenue = brokerProfile.transactions
          .filter((t) => t.status === 'COMPLETED')
          .reduce((sum, t) => sum + (t.amount || 0), 0);
        averageRating = brokerProfile.averageRating || 0;
      }
    } else if (role === 'APPRAISER') {
      const appraiserProfile = await prisma.appraiserProfile.findUnique({
        where: { userId },
        select: {
          id: true,
          averageRating: true,
        },
      });

      if (appraiserProfile) {
        const appraisals = await prisma.appraisal.findMany({
          where: { appraiserId: appraiserProfile.id },
          select: { id: true, value: true, status: true },
        });
        propertyCount = appraisals.length;
        totalRevenue = appraisals
          .filter((a) => a.status === 'COMPLETED')
          .reduce((sum, a) => sum + (a.value || 0), 0);
        averageRating = appraiserProfile.averageRating || 0;
      }
    } else if (role === 'CLIENT') {
      const clientProfile = await prisma.clientProfile.findUnique({
        where: { userId },
        select: { id: true },
      });

      if (clientProfile) {
        inquiryCount = await prisma.inquiry.count({
          where: { clientId: clientProfile.id },
        });
        propertyCount = await prisma.transaction.count({
          where: { clientId: clientProfile.id },
        });
      }
    } else if (role === 'ADMIN') {
      propertyCount = await prisma.property.count();
      inquiryCount = await prisma.inquiry.count();

      const allTransactions = await prisma.transaction.findMany({
        where: { status: 'COMPLETED' },
        select: { amount: true },
      });
      totalRevenue = allTransactions.reduce((sum, t) => sum + (t.amount || 0), 0);
    }

    return NextResponse.json({
      success: true,
      data: {
        properties: propertyCount,
        revenue: totalRevenue,
        inquiries: inquiryCount,
        rating: averageRating,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}

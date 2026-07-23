import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { logError } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isEmailVerified: true,
        createdAt: true,
        brokerProfile: {
          select: {
            id: true,
            licenseNumber: true,
            licenseExpiry: true,
            specializations: true,
            yearsExperience: true,
            bio: true,
            photo: true,
            socialMedia: true,
            contactInfo: true,
            slug: true,
            isVerified: true,
            averageRating: true,
            totalReviews: true,
          },
        },
        appraiserProfile: {
          select: {
            id: true,
            licenseNumber: true,
            licenseExpiry: true,
            specializations: true,
            yearsExperience: true,
            bio: true,
            photo: true,
            socialMedia: true,
            contactInfo: true,
            slug: true,
            isVerified: true,
            averageRating: true,
            totalReviews: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    logError('Failed to fetch profile', { error: String(error) });
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const body = await request.json();

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true, brokerProfile: { select: { id: true } }, appraiserProfile: { select: { id: true } } },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (body.name) {
      await prisma.user.update({ where: { id: userId }, data: { name: body.name } });
    }

    if (user.role === 'BROKER' && user.brokerProfile) {
      const brokerData: any = {};
      if (body.bio !== undefined) brokerData.bio = body.bio;
      if (body.specializations !== undefined) brokerData.specializations = JSON.stringify(body.specializations);
      if (body.contactInfo !== undefined) brokerData.contactInfo = JSON.stringify(body.contactInfo);
      if (body.socialMedia !== undefined) brokerData.socialMedia = JSON.stringify(body.socialMedia);
      if (body.photo !== undefined) brokerData.photo = body.photo;

      if (Object.keys(brokerData).length > 0) {
        await prisma.brokerProfile.update({ where: { id: user.brokerProfile.id }, data: brokerData });
      }
    }

    if (user.role === 'APPRAISER' && user.appraiserProfile) {
      const appraiserData: any = {};
      if (body.bio !== undefined) appraiserData.bio = body.bio;
      if (body.specializations !== undefined) appraiserData.specializations = JSON.stringify(body.specializations);
      if (body.contactInfo !== undefined) appraiserData.contactInfo = JSON.stringify(body.contactInfo);
      if (body.socialMedia !== undefined) appraiserData.socialMedia = JSON.stringify(body.socialMedia);
      if (body.photo !== undefined) appraiserData.photo = body.photo;

      if (Object.keys(appraiserData).length > 0) {
        await prisma.appraiserProfile.update({ where: { id: user.appraiserProfile.id }, data: appraiserData });
      }
    }

    return NextResponse.json({ success: true, message: 'Profile updated' });
  } catch (error) {
    logError('Failed to update profile', { error: String(error) });
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}

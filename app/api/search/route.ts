import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = url.searchParams.get('query') || '';

  try {
    const users = await prisma.user.findMany({
      where: {
        username: {
          contains: query,
          mode: 'insensitive', // البحث غير حساس لحالة الأحرف
        },
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: 'حدث خطأ أثناء البحث' }, { status: 500 });
  }
}
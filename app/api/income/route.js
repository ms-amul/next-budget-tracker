import { NextResponse } from 'next/server';
import connectMongo from '@/lib/mongo';
import Income from '@/models/Income';
import { getServerSession } from 'next-auth/next';

export async function POST(req) {
  await connectMongo();
  const session = await getServerSession(req);
  
  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { name, amount, icon } = await req.json();

  try {
    const newIncome = await Income.create({
      name,
      amount,
      icon,
      createdBy: session.user.id,
    });
    return NextResponse.json(newIncome, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

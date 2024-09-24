import connectMongo from '@/lib/mongodb';
import Transaction from '@/models/Transaction';

export async function POST(req) {
  try {
    await connectMongo();
    const { userId, amount, type, description } = await req.json();
    const transaction = new Transaction({ userId, amount, type, description });
    await transaction.save();
    return new Response(JSON.stringify({ message: 'Transaction created successfully' }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Error creating transaction', error }), { status: 500 });
  }
}

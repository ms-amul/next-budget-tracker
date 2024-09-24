import connectMongo from '@/lib/mongodb';
import Transaction from '@/models/Transaction';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  try {
    await connectMongo();
    const transactions = await Transaction.find({ userId });
    return new Response(JSON.stringify(transactions), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Error fetching transactions', error }), { status: 500 });
  }
}

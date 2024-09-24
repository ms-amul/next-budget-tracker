import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongo";
import Expense from "@/models/Expense";
import { getServerSession } from "next-auth/next";

export async function POST(req) {
  await connectMongo();
  const session = await getServerSession(req);

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { name, amount, budgetId } = await req.json();

  try {
    const newExpense = await Expense.create({
      name,
      amount,
      budgetId,
      createdBy: session.user.id,
    });
    return NextResponse.json(newExpense, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

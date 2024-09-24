import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongo";
import Expense from "@/models/Expense";
import { getServerSession } from "next-auth/next";

// POST method to create a new expense
export async function POST(req) {

  await connectMongo();
  const session = await getServerSession(req);

  console.log(session);

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { name, amount, budgetId } = await req.json();

  console.log(name, session.user.id);

  try {
    const newExpense = await Expense.create({
      name,
      amount,
      budgetId,
      createdBy: session.user.id,
    });
    return NextResponse.json(newExpense, { status: 201 });
  } catch (error) {
    console.log(error.message);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// GET method to fetch all expenses of the session user
export async function GET(req) {
  await connectMongo();
  const session = await getServerSession(req);

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const expenses = await Expense.find({ createdBy: session.user.id });
    return NextResponse.json(expenses, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// PUT method to update an existing expense
export async function PUT(req) {
  await connectMongo();
  const session = await getServerSession(req);

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { id, name, amount, budgetId } = await req.json();

  try {
    const updatedExpense = await Expense.findOneAndUpdate(
      { _id: id, createdBy: session.user.id },
      { name, amount, budgetId },
      { new: true }
    );
    return NextResponse.json(updatedExpense, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// DELETE method to delete an expense
export async function DELETE(req) {
  await connectMongo();
  const session = await getServerSession(req);

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { id } = await req.json();

  try {
    await Expense.findOneAndDelete({ _id: id, createdBy: session.user.id });
    return NextResponse.json({ message: "Expense deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

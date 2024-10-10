import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongo";
import Expense from "@/models/Expense";
import { getServerSession } from "next-auth/next";
import User from "@/models/User";

// POST method to create a new expense
export async function POST(req) {
  await connectMongo();
  const session = await getServerSession(req);

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { name, amount, budgetId } = await req.json();

  const user = await User.findOne({ email: session.user.email });

  try {
    const newExpense = await Expense.create({
      name,
      amount,
      budgetId,
      createdBy: user._id,
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
    const user = await User.findOne({ email: session.user.email });
    const expenses = await Expense.find({ createdBy: user._id }).populate(
      "budgetId"
    );
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
  console.log(req.json());
  try {
    const user = await User.findOne({ email: session.user.email });
    const updatedExpense = await Expense.findOneAndUpdate(
      { _id: id, createdBy: user._id },
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
    const user = await User.findOne({ email: session.user.email });
    await Expense.findOneAndDelete({ _id: id, createdBy: user._id });
    return NextResponse.json({ message: "Expense deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

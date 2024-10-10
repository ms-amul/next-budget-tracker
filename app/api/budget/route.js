import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongo";
import Budget from "@/models/Budget";
import { getServerSession } from "next-auth/next";
import User from "@/models/User";

// POST method to create a new budget
export async function POST(req) {
  await connectMongo();
  const session = await getServerSession(req);

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { name, amount, icon } = await req.json();

  try {
    const user = await User.findOne({ email: session.user.email });
    const newBudget = await Budget.create({
      name,
      amount,
      icon,
      createdBy: user._id,
    });
    return NextResponse.json(newBudget, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// GET method to fetch all budgets of the session user
export async function GET(req) {
  await connectMongo();
  const session = await getServerSession(req);

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const user = await User.findOne({ email: session.user.email });
    const budgets = await Budget.find({ createdBy: user._id });
    // // Repeat the budgets array 100 times
    // let repeatedBudgets = Array(100).fill(budgets).flat();
    return NextResponse.json(budgets, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// PUT method to update an existing budget
export async function PUT(req) {
  await connectMongo();
  const session = await getServerSession(req);

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { id, name, amount, icon } = await req.json();

  try {
    const user = await User.findOne({ email: session.user.email });
    const updatedBudget = await Budget.findOneAndUpdate(
      { _id: id, createdBy: user._id },
      { name, amount, icon },
      { new: true }
    );
    return NextResponse.json(updatedBudget, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// DELETE method to delete a budget
export async function DELETE(req) {
  await connectMongo();
  const session = await getServerSession(req);

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { id } = await req.json();

  try {
    // Fetch the user associated with the session
    const user = await User.findOne({ email: session.user.email });

    // Find and delete the budget (this will also trigger the middleware to delete related expenses)
    const budget = await Budget.findOneAndDelete({
      _id: id,
      createdBy: user._id,
    });
    if (!budget) {
      return NextResponse.json(
        { error: "Budget not found or unauthorized" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "Budget and associated expenses deleted" },
      { status: 200 }
    );
  } catch (error) {
    // Handle any errors that occur during the deletion process
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

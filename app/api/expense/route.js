import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongo";
import Budget from "@/models/Budget";
import Expense from "@/models/Expense";
import { getServerSession } from "next-auth/next";
import User from "@/models/User";

// POST method to create a new expense
export async function POST(req) {
  try {
    await connectMongo();
    const session = await getServerSession(req);

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { name, amount, budgetId } = await req.json();
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const newExpense = await Expense.create({
      name,
      amount,
      budgetId,
      createdBy: user._id,
    });
    return NextResponse.json(newExpense, { status: 201 });
  } catch (error) {
    console.error("Error in POST:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// GET method to fetch all expenses of the session user
export async function GET(req) {
  try {
    await connectMongo();
    const session = await getServerSession(req);

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const expenses = await Expense.find({ createdBy: user._id }).populate(
      "budgetId"
    );
    return NextResponse.json(expenses, { status: 200 });
  } catch (error) {
    console.error("Error in GET:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT method to update an existing expense
export async function PUT(req) {
  try {
    await connectMongo();
    const session = await getServerSession(req);

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { id, name, amount, budgetId } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updatedExpense = await Expense.findOneAndUpdate(
      { _id: id, createdBy: user._id },
      { name, amount, budgetId },
      { new: true }
    );

    if (!updatedExpense) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    return NextResponse.json(updatedExpense, { status: 200 });
  } catch (error) {
    console.error("Error in PUT:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE method to delete an expense
export async function DELETE(req) {
  try {
    await connectMongo();
    const session = await getServerSession(req);

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const deletedExpense = await Expense.findOneAndDelete({
      _id: id,
      createdBy: user._id,
    });
    if (!deletedExpense) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Expense deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error in DELETE:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

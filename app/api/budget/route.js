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
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const newBudget = await Budget.create({
      name,
      amount,
      icon,
      createdBy: user._id,
    });

    return NextResponse.json(newBudget, { status: 201 });
  } catch (error) {
    console.error("Error creating budget:", error.message);
    return NextResponse.json(
      { error: "Error creating budget" },
      { status: 400 }
    );
  }
}

// GET method to fetch all budgets of the session user for a specific month
export async function GET(req) {
  await connectMongo();
  const session = await getServerSession(req);

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Extract month parameter from the query string
    const { searchParams } = new URL(req.url);
    const month = searchParams.get("month"); // Expected format: YYYY-MM

    let query = { createdBy: user._id };

    // If month is provided, add it to the query
    if (month) {
      const startOfMonth = new Date(`${month}-01`);
      const endOfMonth = new Date(startOfMonth);
      endOfMonth.setMonth(endOfMonth.getMonth() + 1);

      query = {
        ...query,
        createdAt: { $gte: startOfMonth, $lt: endOfMonth },
      };
    }

    // Fetch budgets based on the constructed query
    const budgets = await Budget.find(query);

    return NextResponse.json(budgets, { status: 200 });
  } catch (error) {
    console.error("Error fetching budgets:", error.message);
    return NextResponse.json(
      { error: "Error fetching budgets" },
      { status: 400 }
    );
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
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updatedBudget = await Budget.findOneAndUpdate(
      { _id: id, createdBy: user._id },
      { name, amount, icon },
      { new: true }
    );

    if (!updatedBudget) {
      return NextResponse.json(
        { error: "Budget not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedBudget, { status: 200 });
  } catch (error) {
    console.error("Error updating budget:", error.message);
    return NextResponse.json(
      { error: "Error updating budget" },
      { status: 400 }
    );
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
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

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
    console.error("Error deleting budget:", error.message);
    return NextResponse.json(
      { error: "Error deleting budget" },
      { status: 400 }
    );
  }
}

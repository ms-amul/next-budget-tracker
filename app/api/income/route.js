import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongo";
import Income from "@/models/Income";
import { getServerSession } from "next-auth/next";
import User from "@/models/User";

// POST method to create a new income
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

    const newIncome = await Income.create({
      name,
      amount,
      icon,
      createdBy: user._id,
    });

    return NextResponse.json(newIncome, { status: 201 });
  } catch (error) {
    console.error("Error creating income:", error.message);
    return NextResponse.json(
      { error: "Error creating income" },
      { status: 400 }
    );
  }
}

// GET method to fetch all incomes of the session user for a specific month
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

    // Fetch incomes based on the constructed query
    const incomes = await Income.find(query);

    return NextResponse.json(incomes, { status: 200 });
  } catch (error) {
    console.error("Error fetching incomes:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT method to update an existing income
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

    const updatedIncome = await Income.findOneAndUpdate(
      { _id: id, createdBy: user._id },
      { name, amount, icon },
      { new: true }
    );

    if (!updatedIncome) {
      return NextResponse.json(
        { error: "Income not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedIncome, { status: 200 });
  } catch (error) {
    console.error("Error updating income:", error.message);
    return NextResponse.json(
      { error: "Error updating income" },
      { status: 400 }
    );
  }
}

// DELETE method to delete an income
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

    const deletedIncome = await Income.findOneAndDelete({
      _id: id,
      createdBy: user._id,
    });

    if (!deletedIncome) {
      return NextResponse.json(
        { error: "Income not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Income deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting income:", error.message);
    return NextResponse.json(
      { error: "Error deleting income" },
      { status: 400 }
    );
  }
}

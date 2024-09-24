import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongo";
import Income from "@/models/Income";
import { getServerSession } from "next-auth/next";

// POST method to create a new income
export async function POST(req) {
  await connectMongo();
  const session = await getServerSession(req);

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
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

// GET method to fetch all incomes of the session user
export async function GET(req) {
  await connectMongo();
  const session = await getServerSession(req);

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const incomes = await Income.find({ createdBy: session.user.id });
    return NextResponse.json(incomes, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
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
    const updatedIncome = await Income.findOneAndUpdate(
      { _id: id, createdBy: session.user.id },
      { name, amount, icon },
      { new: true }
    );
    return NextResponse.json(updatedIncome, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
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
    await Income.findOneAndDelete({ _id: id, createdBy: session.user.id });
    return NextResponse.json({ message: "Income deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

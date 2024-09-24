"use client";

import { Spin } from "antd";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState([]);

  const fetchData = async () => {
    try {
      const resExpense = await fetch("/api/expense");
      const resBudget = await fetch("/api/budget");

      const expensesData = await resExpense.json();
      const budgetsData = await resBudget.json();

      setExpenses(expensesData);
      setBudgets(budgetsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (status === "loading") {
    return (
      <>
        <div className="flex flex-col scale-150 h-screen w-screen fixed items-center justify-center gap-3">
          <Spin size="large"></Spin>
          <p>Loading your data!</p>
        </div>
      </>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="text-center">
        <p>You are not signed in. Please sign in to access the dashboard.</p>
        <Link href="/">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="p-4">
      <p className="gradient-text-blue text-lg md:text-2xl font-semibold">Hello 👋 {session?.user?.name}, track all your expenses, budget and incomes...</p>
    </div>
  );
}

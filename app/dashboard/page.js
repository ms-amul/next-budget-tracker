"use client";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import BudgetChart from "@/components/BudgetChart";
import ExpensesChart from "@/components/ExpensesChart";
import IncomeChart from "@/components/IncomeChart";
import IncomeTable from "@/components/IncomeTable";
import ExpenseTable from "@/components/ExpensesTable";
import BudgetTable from "@/components/BudgetTable";
import Link from "next/link";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const resIncome = await fetch("/api/income");
        const resExpense = await fetch("/api/expense");
        const resBudget = await fetch("/api/budget");

        setIncomes(await resIncome.json());
        setExpenses(await resExpense.json());
        setBudgets(await resBudget.json());
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, []);

  if (status === "loading") {
    return <p>Loading...</p>;
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
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex items-center">
          <img
            src={session?.user?.image}
            alt={session?.user?.name}
            className="w-10 h-10 rounded-full"
          />
          <button onClick={() => signOut()} className="ml-4 text-red-500">
            Sign out
          </button>
        </div>
      </div>

      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <BudgetChart budgets={budgets} />
        </div>
        <div>
          <IncomeChart incomes={incomes} />
        </div>
        <div className="col-span-2">
          <ExpensesChart expenses={expenses} />
        </div>
      </div> */}

      <h2 className="text-2xl font-bold mb-4">Tables</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-2">Income Table</h3>
          <IncomeTable incomes={incomes} />
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-2">Expenses Table</h3>
          <ExpenseTable expenses={expenses} />
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-2">Budget Table</h3>
          <BudgetTable budgets={budgets} />
        </div>
      </div>
    </div>
  );
}

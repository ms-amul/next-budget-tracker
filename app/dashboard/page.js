"use client";
import BudgetCard from "@/components/BudgetCard"; // New Budget Card component
import CurrentBalanceCard from "@/components/CurrentBalanceCard"; // New Current Balance Card component
import ExpenseTable from "@/components/ExpensesTable";
import IncomeCarousel from "@/components/IncomeCarousel"; // New Income Carousel component
import Modal from "@/components/Modal";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa"; // Example icon from react-icons

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");

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

  const handleOpenModal = (type) => {
    setModalType(type);
    setShowModal(true);
  };

  const currentBalance = 1000; // Hardcoded current balance

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
      {/* Budget and Current Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <BudgetCard budgets={budgets} onOpenModal={handleOpenModal} />
        <CurrentBalanceCard balance={currentBalance} />
      </div>
      {/* Income Carousel */}
      <h2 className="text-2xl font-bold mb-4">Income Sources</h2>
      <IncomeCarousel /> {/* Display income sources horizontally */}
      {/* Expense Table */}
      <h2 className="text-2xl font-bold mb-4">Expenses</h2>
      <div className="bg-white p-4 rounded-lg shadow">
        <ExpenseTable expenses={expenses} />
      </div>
      {/* Modal for Adding Items */}
      {showModal && (
        <Modal
          type={modalType}
          onClose={() => setShowModal(false)}
          refreshData={fetchData}
        />
      )}
    </div>
  );
}

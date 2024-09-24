"use client";
import NeumorphicCard from "@/components/QuickCards";
import ExpenseTable from "@/components/ExpenseTable";
import { Modal } from "antd";
import { useEffect, useState } from "react";
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import { GiExpense, GiWallet } from "react-icons/gi";
import { Spin } from "antd";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Budget from "@/components/Budget";
import Income from "@/components/Income";
import Expense from "@/components/Expense";
export default function Dashboard() {
  const { data: session, status } = useSession();

  const [budgets, setBudgets] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [monthlyTotals, setMonthlyTotals] = useState({
    totalBudget: 0,
    totalIncome: 0,
    totalExpenses: 0,
  });

  // Modal State
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState("");

  // Open Modal function
  const handleOpenModal = (type) => {
    setModalType(type);
    setIsModalVisible(true);
  };

  // Close Modal function
  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  // Function to fetch the data from APIs
  const fetchData = async () => {
    try {
      const [budgetRes, incomeRes, expenseRes] = await Promise.all([
        fetch("/api/budget"),
        fetch("/api/income"),
        fetch("/api/expense"),
      ]);

      const budgetsData = await budgetRes.json();
      const incomesData = await incomeRes.json();
      const expensesData = await expenseRes.json();

      console.log(budgetsData);

      setBudgets(budgetsData);
      setIncomes(incomesData);
      setExpenses(expensesData);

      // Calculate monthly totals
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();

      const isCurrentMonth = (dateString) => {
        const date = new Date(dateString);
        return (
          date.getMonth() === currentMonth && date.getFullYear() === currentYear
        );
      };

      const totalBudget = budgetsData.reduce(
        (acc, budget) => acc + budget.limit,
        0
      );
      const totalIncome = incomesData.reduce(
        (acc, income) =>
          isCurrentMonth(income.createdAt) ? acc + income.amount : acc,
        0
      );
      const totalExpenses = expensesData.reduce(
        (acc, expense) =>
          isCurrentMonth(expense.createdAt) ? acc + expense.amount : acc,
        0
      );

      setMonthlyTotals({ totalBudget, totalIncome, totalExpenses });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getBudgetCategoriesForDropdown = () => {
    return budgets.map((budget) => ({
      category: budget.category,
      _id: budget._id,
    }));
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (status === "loading") {
    return (
      <div className="flex flex-col scale-150 h-screen w-screen fixed items-center justify-center gap-3">
        <Spin size="large"></Spin>
        <p>Loading your data!</p>
      </div>
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
      <h1 className="gradient-text-blue text-lg md:text-2xl font-semibold">
        Hello 👋 {session?.user?.name}, track all your expenses, budget and
        incomes...
      </h1>

      {/* Display Neumorphic Cards with Monthly Totals */}
      <div className="flex flex-wrap justify-center">
        <NeumorphicCard
          title="Budget"
          amount={`₹${monthlyTotals.totalBudget}`}
          icon={<GiWallet />}
          onEyeClick={() => handleOpenModal("budget")}
        />
        <NeumorphicCard
          title="Income"
          amount={`₹${monthlyTotals.totalIncome}`}
          icon={<FaMoneyBillTrendUp />}
          onEyeClick={() => handleOpenModal("income")}
        />
        <NeumorphicCard
          title="Expenses"
          amount={`₹${monthlyTotals.totalExpenses}`}
          icon={<GiExpense />}
          onEyeClick={() => handleOpenModal("expense")}
        />
      </div>

      <ExpenseTable />

      {/* Modal to display details */}
      <Modal
        title={null}
        visible={isModalVisible}
        onCancel={handleCloseModal}
        footer={null}
      >
        {/* Render the content based on modal type */}
        {modalType === "budget" && <Budget budget={budgets} />}
        {modalType === "income" && <Income income={incomes} />}
        {modalType === "expense" && (
          <Expense getCategories={getBudgetCategoriesForDropdown} />
        )}
      </Modal>
    </div>
  );
}

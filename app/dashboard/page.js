"use client";

import NeumorphicCard from "@/components/QuickCards";
import ExpenseTable from "@/components/ExpenseTable";
import { useEffect, useState } from "react";
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import { GiExpense, GiWallet } from "react-icons/gi";
import { Spin } from "antd";
import { useSession } from "next-auth/react";
import Link from "next/link";
import CustomDrawer from "@/components/CustomDrawer";
import CustomModal from "@/components/CustomModal";
import dayjs from "dayjs"; // Assuming dayjs is already installed

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

  // State for Drawers and Modal
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [drawerType, setDrawerType] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState("");

  const handleOpenDrawer = (type) => {
    setDrawerType(type);
    setIsDrawerVisible(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerVisible(false);
  };

  const handleOpenModal = (type) => {
    setModalType(type);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

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

      setBudgets(budgetsData);
      setIncomes(incomesData);
      setExpenses(expensesData);

      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();

      const isCurrentMonth = (dateString) => {
        const date = new Date(dateString);
        return (
          date.getMonth() === currentMonth && date.getFullYear() === currentYear
        );
      };

      const totalBudget = budgetsData.reduce(
        (acc, budget) =>
          isCurrentMonth(budget.createdAt) ? acc + budget.amount : acc,
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

  const getBudgetCategoriesForDropdown = (selectedMonth) => {
    const formattedMonth = selectedMonth.format("MMMM YYYY");

    return budgets
      .filter((budget) => {
        const budgetMonthYear = dayjs(budget.createdAt).format("MMMM YYYY");
        return budgetMonthYear === formattedMonth;
      })
      .map((budget) => ({
        name: budget.name,
        _id: budget._id,
        icon: budget.icon,
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

      <div className="flex flex-wrap justify-center">
        {/* Budget Card */}
        <NeumorphicCard
          title="Budget"
          amount={`₹${monthlyTotals.totalBudget}`}
          icon={<GiWallet />}
          onEyeClick={() => handleOpenDrawer("budget")}
        />

        {/* Income Card */}
        <NeumorphicCard
          title="Income"
          amount={`₹${monthlyTotals.totalIncome}`}
          icon={<FaMoneyBillTrendUp />}
          onEyeClick={() => handleOpenDrawer("income")}
        />

        {/* Expenses Card */}
        <NeumorphicCard
          title="Expenses"
          amount={`₹${monthlyTotals.totalExpenses}`}
          icon={<GiExpense />}
          onEyeClick={() => handleOpenModal("expense")}
        />
      </div>

      <ExpenseTable
        expenses={expenses}
        getCategories={getBudgetCategoriesForDropdown}
        addExpense={() => handleOpenModal("expense")}
      />
      {/* Custom Drawer */}
      <CustomDrawer
        isDrawerVisible={isDrawerVisible}
        drawerType={drawerType}
        handleCloseDrawer={handleCloseDrawer}
        handleOpenModal={handleOpenModal}
        budgets={budgets}
        incomes={incomes}
        fetchData={fetchData}
      />
      {/* Custom Modal */}
      <CustomModal
        isModalVisible={isModalVisible}
        modalType={modalType}
        handleCloseModal={handleCloseModal}
        budgets={budgets}
        incomes={incomes}
        getBudgetCategoriesForDropdown={getBudgetCategoriesForDropdown}
        fetchData={fetchData}
      />
    </div>
  );
}

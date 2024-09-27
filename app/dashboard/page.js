"use client";
import NeumorphicCard from "@/components/QuickCards";
import ExpenseTable from "@/components/ExpenseTable";
import { Modal, Drawer, Button } from "antd";
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

  // State for Drawers and Modal
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [drawerType, setDrawerType] = useState(""); // Determines if it's 'budget' or 'income'
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState(""); // For the modal to know what to display

  // Open Drawer
  const handleOpenDrawer = (type) => {
    setDrawerType(type);
    setIsDrawerVisible(true);
  };

  // Close Drawer
  const handleCloseDrawer = () => {
    setIsDrawerVisible(false);
  };

  // Open Modal from Drawer
  const handleOpenModal = (type) => {
    setModalType(type);
    setIsModalVisible(true);
  };

  // Close Modal
  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  // Fetch Data from APIs
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
        (acc, budget) => acc + budget.amount,
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
        Hello 👋 {session?.user?.name}, track all your expenses, budget and incomes...
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
      />

      {/* Drawer for Budget and Income */}
      <Drawer
        title={drawerType === "budget" ? "Budgets" : "Incomes"}
        placement="right"
        onClose={handleCloseDrawer}
        visible={isDrawerVisible}
        width={400}
      >
        {/* Button to add Budget or Income */}
        <Button
          type="primary"
          className="mb-4"
          onClick={() => handleOpenModal(drawerType)}
        >
          Add {drawerType === "budget" ? "Budget" : "Income"}
        </Button>

        {/* List of Budgets or Incomes */}
        {drawerType === "budget" && (
          <div>
            {budgets.map((budget) => (
              <div key={budget._id} className="p-2 bg-gray-100 rounded my-2">
                <p>{budget.name}: ₹{budget.amount}</p>
              </div>
            ))}
          </div>
        )}
        {drawerType === "income" && (
          <div>
            {incomes.map((income) => (
              <div key={income._id} className="p-2 bg-gray-100 rounded my-2">
                <p>{income.name}: ₹{income.amount}</p>
              </div>
            ))}
          </div>
        )}
      </Drawer>

      {/* Modal for adding Budget, Income, or Expense */}
      <Modal
        title={modalType === "budget" ? "Add Budget" : modalType === "income" ? "Add Income" : "Add Expense"}
        visible={isModalVisible}
        onCancel={handleCloseModal}
        footer={null}
      >
        {modalType === "budget" && <Budget budget={budgets} />}
        {modalType === "income" && <Income income={incomes} />}
        {modalType === "expense" && (
          <Expense getCategories={getBudgetCategoriesForDropdown} />
        )}
      </Modal>
    </div>
  );
}

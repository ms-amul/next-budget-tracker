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
import {
  RiMoneyDollarCircleFill,
  RiEdit2Line,
  RiDeleteBinLine,
} from "react-icons/ri";

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
              <div
                key={budget._id}
                className="p-4 bg-white rounded-lg shadow-md my-4 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 mr-3 flex items-center justify-center bg-gray-200 rounded-full">
                    {budget.icon ? (
                      <span className="text-2xl rounded-full">
                        {budget.icon}
                      </span>
                    ) : (
                      <i className="text-gray-500 text-xl">
                        <RiMoneyDollarCircleFill />
                      </i>
                    )}
                  </div>
                  <div className="flex justify-between w-full">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {budget.name}
                    </h3>
                    <span className="text-gray-600 font-medium">
                      ₹{budget.amount}
                    </span>
                  </div>
                </div>
                <div className="flex justify-end space-x-4">
                  <button className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-300">
                    <i className="text-lg">
                      <RiEdit2Line /> {/* React Icon for Edit */}
                    </i>
                  </button>
                  <button className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition duration-300">
                    <i className="text-lg">
                      <RiDeleteBinLine />
                    </i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {drawerType === "income" && (
          <div>
            {incomes.map((income) => (
              <div
                key={income._id}
                className="p-4 bg-white rounded-lg shadow-md my-4 hover:shadow-lg transition-shadow duration-300"
              >
                {/* Income Info */}
                <div className="flex items-center mb-4">
                  {/* Income Icon */}
                  <div className="w-8 h-8 mr-3 flex items-center justify-center bg-gray-200 rounded-full">
                    {income.icon ? (
                      <span
                        className="text-2xl rounded-full"
                      >{income.icon}</span>
                    ) : (
                      <i className="text-gray-500 text-xl">
                        {" "}
                        {/* Default Icon */}
                        <RiMoneyDollarCircleFill />
                      </i>
                    )}
                  </div>

                  {/* Income Name and Amount */}
                  <div className="flex justify-between w-full">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {income.name}
                    </h3>
                    <span className="text-gray-600 font-medium">
                      ₹{income.amount}
                    </span>
                  </div>
                </div>

                {/* Icons at Bottom */}
                <div className="flex justify-end space-x-4">
                  <button className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-300">
                    <i className="text-lg">
                      <RiEdit2Line /> {/* React Icon for Edit */}
                    </i>
                  </button>
                  <button className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition duration-300">
                    <i className="text-lg">
                      <RiDeleteBinLine /> {/* React Icon for Delete */}
                    </i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Drawer>

      {/* Modal for adding Budget, Income, or Expense */}
      <Modal
        title={
          modalType === "budget"
            ? "Add Budget"
            : modalType === "income"
            ? "Add Income"
            : "Add Expense"
        }
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

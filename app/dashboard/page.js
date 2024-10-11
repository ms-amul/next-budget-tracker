"use client";
import NeumorphicCard from "@/components/QuickCards";
import ExpenseTable from "@/components/ExpenseTable";
import Graph from "@/components/Graph";
import { useEffect, useState } from "react";
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import { GiExpense, GiWallet } from "react-icons/gi";
import { Spin, Button } from "antd";
import { useSession } from "next-auth/react";
import Link from "next/link";
import CustomDrawer from "@/components/CustomDrawer";
import CustomModal from "@/components/CustomModal";
import dayjs from "dayjs";
import GeminiModal from "@/components/GeminiSuggestion";

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

  const handleOpenModal = (type, data) => {
    setModalType({
      type,
      data,
    });
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const fetchData = async () => {
    try {
      const [budgetRes, incomeRes, expenseRes] = await Promise.allSettled([
        fetch("/api/budget"),
        fetch("/api/income"),
        fetch("/api/expense"),
      ]);
  
      const budgetsData =
        budgetRes.status === "fulfilled" ? await budgetRes.value.json() : [];
      const incomesData =
        incomeRes.status === "fulfilled" ? await incomeRes.value.json() : [];
      const expensesData =
        expenseRes.status === "fulfilled" ? await expenseRes.value.json() : [];
  
      if (budgetRes.status === "rejected") {
        console.error("Failed to fetch budgets:", budgetRes.reason);
      }
      if (incomeRes.status === "rejected") {
        console.error("Failed to fetch incomes:", incomeRes.reason);
      }
      if (expenseRes.status === "rejected") {
        console.error("Failed to fetch expenses:", expenseRes.reason);
      }
  
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
    if (budgets.length > 0) {
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
    }
    return [];
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchData();
    }
  }, [status]);

  if (status === "loading") {
    return (
      <div className="flex flex-col scale-150 h-screen w-full fixed items-center justify-center gap-3">
        <Spin size="large"></Spin>
        <p>Loading your data!</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex items-center justify-center min-h-[90vh]">
        <div className="rounded-lg p-8 max-w-xl w-full text-center">
          <img
            src="/load.gif"
            alt="loading.."
            className="mix-blend-multiply rounded-xl"
          />
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Access Denied
          </h2>
          <p className="text-gray-600 mb-6">
            You are not signed in. Please sign in to access the dashboard.
          </p>
          <Link href="/" className="">
            <Button color="primary" variant="outlined">
              Go to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex gap-1 items-center">
        <h1 className="gradient-text-blue text-lg md:text-2xl font-semibold flex items-center">
          <span className="text-white p-2 rounded-full hidden md:block">
            {dayjs().format("MMMM YYYY")},
          </span>
          Hello 👋 {session?.user?.name}, track all your expenses, budget and
          incomes...
        </h1>
      </div>
      <GeminiModal income={incomes} budget={budgets} expenses={expenses} />

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
      <Graph expenses={expenses} budgets={budgets} />
      <ExpenseTable
        expenses={expenses}
        getCategories={getBudgetCategoriesForDropdown}
        addExpense={(data) => handleOpenModal("expense", data)}
        fetchData={fetchData}
      />

      <CustomDrawer
        isDrawerVisible={isDrawerVisible}
        drawerType={drawerType}
        handleCloseDrawer={handleCloseDrawer}
        handleOpenModal={handleOpenModal}
        budgets={budgets}
        incomes={incomes}
        fetchData={fetchData}
        isModalVisible={isModalVisible}
        modalType={modalType}
        handleCloseModal={handleCloseModal}
        getBudgetCategoriesForDropdown={getBudgetCategoriesForDropdown}
      />

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

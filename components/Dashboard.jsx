"use client";
import CustomDrawer from "@/components/CustomDrawer";
import CustomModal from "@/components/CustomModal";
import ExpenseTable from "@/components/ExpenseTable";
import GeminiModal from "@/components/GeminiSuggestion";
import Graph from "@/components/Graph";
import NeumorphicCard from "@/components/QuickCards";
import { message, Spin } from "antd";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import { GiExpense, GiWallet } from "react-icons/gi";

export default function Dashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [monthlyTotals, setMonthlyTotals] = useState({
    totalBudget: 0,
    totalIncome: 0,
    totalExpenses: 0,
  });

  const [budgets, setBudgets] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(dayjs());

  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [drawerType, setDrawerType] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState("");
  const [loading, setLoading] = useState(false);

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

  const fetchData = async (month = selectedMonth) => {
    setLoading(true);
    try {
      const formattedMonth = month.format("YYYY-MM");

      const [budgetRes, incomeRes, expenseRes] = await Promise.allSettled([
        fetch(`/api/budget?month=${formattedMonth}`),
        fetch(`/api/income?month=${formattedMonth}`),
        fetch(`/api/expense?month=${formattedMonth}`),
      ]);

      const budgetsData =
        budgetRes.status === "fulfilled" ? await budgetRes.value.json() : [];
      const incomesData =
        incomeRes.status === "fulfilled" ? await incomeRes.value.json() : [];
      const expensesData =
        expenseRes.status === "fulfilled" ? await expenseRes.value.json() : [];

      if (budgetRes.status === "rejected") {
        message.error("Failed to fetch budgets.");
      }
      if (incomeRes.status === "rejected") {
        message.error("Failed to fetch incomes.");
      }
      if (expenseRes.status === "rejected") {
        message.error("Failed to fetch expenses.");
      }

      setBudgets(budgetsData);
      setIncomes(incomesData);
      setExpenses(expensesData);

      const totalBudget = budgetsData.reduce(
        (acc, budget) => acc + budget.amount,
        0
      );
      const totalIncome = incomesData.reduce(
        (acc, income) => acc + income.amount,
        0
      );
      const totalExpenses = expensesData.reduce(
        (acc, expense) => acc + expense.amount,
        0
      );
      setMonthlyTotals({ totalBudget, totalIncome, totalExpenses });
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(selectedMonth);
  }, [selectedMonth]);

  const getBudgetCategoriesForDropdown = () => {
    return budgets.length > 0
      ? budgets.map((budget) => ({
          name: budget.name,
          _id: budget._id,
          icon: budget.icon,
        }))
      : [];
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex flex-col scale-150 h-screen w-full fixed items-center justify-center gap-3">
        <Spin size="large"></Spin>
        <p className="text-slate-200">Loading your data!</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/");
    return null;
  }

  return (
    <div className="p-4">
      <div className="flex gap-1 items-center">
        <h1 className="gradient-text-white text-lg md:text-2xl font-semibold flex items-center">
          Hello 👋 {session?.user?.name}, manage your finances, budget, and
          income with AI-powered insights and monthly reports...
        </h1>
      </div>

      <GeminiModal
        income={incomes}
        budget={budgets}
        expenses={expenses}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        user={session?.user?.name}
      />

      <div className="flex flex-wrap justify-center quickcards">
        {/* Budget Card */}
        <NeumorphicCard
          title="Budget"
          amount={monthlyTotals.totalBudget}
          icon={<GiWallet />}
          onEyeClick={() => handleOpenDrawer("budget")}
        />

        {/* Income Card */}
        <NeumorphicCard
          title="Income"
          amount={monthlyTotals.totalIncome}
          icon={<FaMoneyBillTrendUp />}
          onEyeClick={() => handleOpenDrawer("income")}
        />

        {/* Expenses Card */}
        <NeumorphicCard
          title="Expenses"
          amount={monthlyTotals.totalExpenses}
          icon={<GiExpense />}
          onEyeClick={() => handleOpenModal("expense")}
        />
      </div>
      <Graph
        expenses={expenses}
        budgets={budgets}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
      />
      <ExpenseTable
        expenses={expenses}
        getCategories={getBudgetCategoriesForDropdown}
        addExpense={(data) => handleOpenModal("expense", data)}
        fetchData={fetchData}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
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
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
      />

      <CustomModal
        isModalVisible={isModalVisible}
        modalType={modalType}
        handleCloseModal={handleCloseModal}
        budgets={budgets}
        incomes={incomes}
        getBudgetCategoriesForDropdown={getBudgetCategoriesForDropdown}
        fetchData={fetchData}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
      />
    </div>
  );
}

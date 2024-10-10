import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { DatePicker } from "antd";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement, // Import LineElement for line charts
  Title,
  Tooltip,
  Legend,
  PointElement, // Import PointElement for line chart points
} from "chart.js";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";

// Register the dayjs plugin
dayjs.extend(isBetween);

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement, // Register LineElement
  PointElement, // Register PointElement
  Title,
  Tooltip,
  Legend
);

const { MonthPicker } = DatePicker;

export default function MonthlyExpenseGraph({ expenses, budgets }) {
  const [selectedMonth, setSelectedMonth] = useState(dayjs()); // Default to current month
  const [dailyExpenses, setDailyExpenses] = useState([]);
  const [totalBudget, setTotalBudget] = useState(0); // Track total budget for the selected month

  // Function to group and sum expenses by day for the selected month
  const calculateDailyExpenses = (selectedMonth) => {
    const startOfMonth = selectedMonth.startOf("month");
    const endOfMonth = selectedMonth.endOf("month");

    const dailyExpenseMap = {};
    let monthlyTotalBudget = 0;

    // Sum all budgets for the selected month
    budgets.forEach((budget) => {
      if (dayjs(budget.createdAt).isSame(selectedMonth, "month")) {
        monthlyTotalBudget += budget.amount;
      }
    });
    
    setTotalBudget(monthlyTotalBudget); // Set the total budget for display

    // Loop through all expenses and sum them by day
    expenses.forEach((expense) => {
      const expenseDate = dayjs(expense.createdAt);
      // Check if the expense falls in the selected month
      if (expenseDate.isBetween(startOfMonth, endOfMonth, null, "[]")) {
        const day = expenseDate.date(); // Day of the month
        if (!dailyExpenseMap[day]) {
          dailyExpenseMap[day] = 0;
        }
        dailyExpenseMap[day] += expense.amount;
      }
    });

    // Convert the dailyExpenseMap to an array to be used in the graph
    const dailyData = [];
    for (let i = 1; i <= selectedMonth.daysInMonth(); i++) {
      dailyData.push({
        day: i,
        total: dailyExpenseMap[i] || 0, // Use 0 if no expenses for the day
      });
    }

    setDailyExpenses(dailyData);
  };

  // Handle month selection change
  const handleMonthChange = (date) => {
    setSelectedMonth(date);
    calculateDailyExpenses(date);
  };

  useEffect(() => {
    calculateDailyExpenses(selectedMonth); // Calculate for the current month initially
  }, [expenses, selectedMonth, budgets]);

  // Prepare data for the Chart.js Bar Chart
  const chartData = {
    labels: dailyExpenses.map((data) => data.day),
    datasets: [
      {
        label: "Total Expense (₹)",
        data: dailyExpenses.map((data) => data.total),
        backgroundColor: dailyExpenses.map((data) =>
          data.total <= totalBudget
            ? "rgba(76, 175, 80, 0.7)"
            : "rgba(244, 67, 54, 0.7)"
        ), // Green if within budget, red if exceeding
        borderColor: "rgba(0, 0, 0, 0.2)",
        borderWidth: 1,
      },
      {
        label: "Budget (₹)",
        data: dailyExpenses.map(() => totalBudget), // Budget line
        type: "line",
        borderColor: "rgba(255, 165, 0, 1)", // Orange line for budget
        backgroundColor: "rgba(255, 165, 0, 0.2)",
        borderWidth: 2,
        fill: false,
      },
    ],
  };

  // Chart options for better styling and appearance
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `Expenses for ${selectedMonth.format("MMMM YYYY")}`,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Days",
        },
      },
      y: {
        title: {
          display: true,
          text: "Total Expense (₹)",
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div>
      <div className="my-4 text-right">
        {/* Month Picker to select other months */}
        <MonthPicker
          onChange={handleMonthChange}
          value={selectedMonth}
          placeholder="Select Month"
          allowClear={false}
        />
      </div>

      <div style={{ width: "100%", height: "400px" }}>
        <Bar data={chartData} options={chartOptions} />
      </div>

      {/* Budget and Expense Summary */}
      <div className="mt-4">
        <h3>
          Total Expenses: ₹
          {dailyExpenses.reduce((sum, data) => sum + data.total, 0)}
        </h3>
        <h3>Total Budget for the Month: ₹{totalBudget}</h3>
        <h3>
          Remaining Budget: ₹
          {totalBudget - dailyExpenses.reduce((sum, data) => sum + data.total, 0)}
        </h3>
      </div>
    </div>
  );
}

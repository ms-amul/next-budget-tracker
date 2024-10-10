import { DatePicker } from "antd";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2"; // Use Line chart instead of Bar
import { BiSolidCommentError } from "react-icons/bi";

import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";

dayjs.extend(isBetween);

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement, // Register PointElement for line chart points
  Title,
  Tooltip,
  Legend
);

const { MonthPicker } = DatePicker;

export default function MonthlyExpenseGraph({ expenses, budgets }) {
  const [selectedMonth, setSelectedMonth] = useState(dayjs());
  const [dailyExpenses, setDailyExpenses] = useState([]);
  const [totalBudget, setTotalBudget] = useState(0);

  const calculateDailyExpenses = (selectedMonth) => {
    const startOfMonth = selectedMonth.startOf("month");
    const endOfMonth = selectedMonth.endOf("month");

    const dailyExpenseMap = {};
    let monthlyTotalBudget = 0;

    budgets.forEach((budget) => {
      if (dayjs(budget.createdAt).isSame(selectedMonth, "month")) {
        monthlyTotalBudget += budget.amount;
      }
    });

    setTotalBudget(monthlyTotalBudget);

    expenses.forEach((expense) => {
      const expenseDate = dayjs(expense.createdAt);
      if (expenseDate.isBetween(startOfMonth, endOfMonth, null, "[]")) {
        const day = expenseDate.date();
        if (!dailyExpenseMap[day]) {
          dailyExpenseMap[day] = 0;
        }
        dailyExpenseMap[day] += expense.amount;
      }
    });

    const dailyData = [];
    for (let i = 1; i <= selectedMonth.daysInMonth(); i++) {
      dailyData.push({
        day: i,
        total: dailyExpenseMap[i] || 0,
      });
    }

    setDailyExpenses(dailyData);
  };

  const handleMonthChange = (date) => {
    setSelectedMonth(date);
    calculateDailyExpenses(date);
  };

  useEffect(() => {
    calculateDailyExpenses(selectedMonth);
  }, [expenses, selectedMonth, budgets]);

  const chartData = {
    labels: dailyExpenses.map((data) => data.day),
    datasets: [
      {
        label: "Total Expense (₹)",
        data: dailyExpenses.map((data) => data.total),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderWidth: 2,
        fill: true, // Filling under the line to give better visual impact
        pointBackgroundColor: "rgba(255, 99, 132, 0.7)", // Point color
        pointRadius: 4, // Make points more visible
      },
      {
        label: "Budget (₹)",
        data: dailyExpenses.map(() => totalBudget),
        borderColor: "rgba(255, 165, 0, 1)",
        backgroundColor: "rgba(255, 165, 0, 0.2)",
        borderWidth: 2,
        fill: false,
        borderDash: [10, 5], // Dashed line for budget
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
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
      <div className="flex items-baseline gap-2 justify-end">
      <BiSolidCommentError />
        <h3 className="gradient-text-green font-semibold">
           Remaining Budget: ₹{" "}
          {totalBudget -
            dailyExpenses.reduce((sum, data) => sum + data.total, 0)}
        </h3>
        <MonthPicker
          onChange={handleMonthChange}
          value={selectedMonth}
          placeholder="Select Month"
          allowClear={false}
        />
      </div>

      <div style={{ width: "100%", height: "500px" }}>
        {" "}
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}

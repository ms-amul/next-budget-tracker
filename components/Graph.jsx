import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { BiSolidCommentError } from "react-icons/bi";
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
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
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function MonthlyExpenseGraph({ expenses, budgets, selectedMonth }) {
  const [dailyExpenses, setDailyExpenses] = useState([]);
  const [totalBudget, setTotalBudget] = useState(0);
  const [isBlinking, setIsBlinking] = useState(false); // State to handle blinking effect

  const calculateDailyExpenses = (selectedMonth) => {
    const today = dayjs();
    const startOfMonth = selectedMonth.startOf("month");

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
      if (expenseDate.isBetween(startOfMonth, today, null, "[]")) {
        const day = expenseDate.date();
        if (!dailyExpenseMap[day]) {
          dailyExpenseMap[day] = 0;
        }
        dailyExpenseMap[day] += expense.amount;
      }
    });

    const dailyData = [];
    let runningTotal = 0;

    for (let i = 1; i <= today.date(); i++) {
      runningTotal += dailyExpenseMap[i] || 0;
      dailyData.push({
        day: i,
        total: runningTotal,
      });
    }

    setDailyExpenses(dailyData);
  };

  useEffect(() => {
    calculateDailyExpenses(selectedMonth);
  }, [expenses, selectedMonth, budgets]);

  // Effect to toggle blinking on the last point
  useEffect(() => {
    const interval = setInterval(() => {
      setIsBlinking((prev) => !prev); // Toggle blinking state
    }, 500); // Change color every 500ms for blinking effect

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  const chartData = {
    labels: Array.from({ length: selectedMonth.daysInMonth() }, (_, index) => index + 1), // All days in the month
    datasets: [
      {
        label: "Total Expense (₹)",
        data: dailyExpenses.map((data) => data.total),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.15)",
        borderWidth: 1,
        fill: true,
        pointBackgroundColor: dailyExpenses.map((_, index) =>
          index === dailyExpenses.length - 1
            ? isBlinking
              ? "rgba(255, 132, 0, 0.7)" // Blinking color
              : "rgba(75, 192, 192, 1)" // Normal color
            : "rgba(75, 192, 192, 0)"
        ),
        pointRadius: dailyExpenses.map((_, index) =>
          index === dailyExpenses.length - 1 ? 6 : 0
        ),
        pointHoverRadius: dailyExpenses.map((_, index) =>
          index === dailyExpenses.length - 1 ? 8 : 0
        ),
      },
      {
        label: "Budget (₹)",
        data: Array.from({ length: selectedMonth.daysInMonth() }, () => totalBudget),
        borderColor: "rgba(255, 119, 0, 0.6)",
        borderDash: [10, 5],
        fill: false,
        pointRadius: 0, // No points for the budget line
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
      tooltip: {
        enabled: true,
        position: 'nearest', // Position the tooltip near the point
        callbacks: {
          title: (tooltipItems) => {
            const lastPoint = dailyExpenses[dailyExpenses.length - 1];
            return `${selectedMonth.format("MMMM")} ${lastPoint.day}, ₹${lastPoint.total}`; // Display date and total expense till that day
          },
          label: (tooltipItem) => {
            return ''; // Empty label to avoid showing the default tooltip text
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Days",
        },
        ticks: {
          autoSkip: false, // Prevent skipping of any days on x-axis
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
      <div className="flex items-baseline gap-2 justify-end mt-4">
        <BiSolidCommentError className="text-slate-100" />
        <h3 className="gradient-text-green font-semibold">
          Remaining Budget: ₹{" "}
          {totalBudget -
            (dailyExpenses.length > 0
              ? dailyExpenses[dailyExpenses.length - 1].total
              : 0)}
        </h3>
      </div>

      <div className="w-full" style={{ height: "500px" }}>
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}

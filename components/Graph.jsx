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
import { useEffect, useRef, useState } from "react";
import { Line } from "react-chartjs-2";
import { BiSolidCommentError } from "react-icons/bi";
import { Alert } from "antd";
import { BsGraphUpArrow } from "react-icons/bs";


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

export default function MonthlyExpenseGraph({
  expenses,
  budgets,
  selectedMonth,
}) {
  const [dailyExpenses, setDailyExpenses] = useState([]);
  const [totalBudget, setTotalBudget] = useState(0);
  const [isBlinking, setIsBlinking] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const chartRef = useRef(null);

  useEffect(() => {
    const today = dayjs();
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
    const lastDayToPlot = selectedMonth.isSame(today, "month")
      ? today.date()
      : selectedMonth.daysInMonth();

    for (let i = 1; i <= lastDayToPlot; i++) {
      runningTotal += dailyExpenseMap[i] || 0;
      dailyData.push({ day: i, total: runningTotal });
    }
    setDailyExpenses(dailyData);
    setShowAlert(runningTotal > monthlyTotalBudget);
  }, [expenses, selectedMonth, budgets]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsBlinking((prev) => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const chartData = {
    labels: dailyExpenses.map((data) => data.day),
    datasets: [
      {
        label: "Total Expense (₹)",
        data: dailyExpenses.map((data) => data.total),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 400);
          gradient.addColorStop(0, "rgba(75, 192, 192, 0.4)");
          gradient.addColorStop(1, "rgba(75, 192, 192, 0)");
          return gradient;
        },
        borderWidth: 2,
        fill: true,
        pointBackgroundColor: dailyExpenses.map((_, index) =>
          index === dailyExpenses.length - 1
            ? isBlinking
              ? "#ff8400"
              : "#4bc0c0"
            : "#4bc0c0"
        ),
        pointRadius: dailyExpenses.map((_, index) =>
          index === dailyExpenses.length - 1 ? (isBlinking ? 6 : 4) : 1
        ),
        pointHoverRadius: 8,
      },
      {
        label: "Budget (₹)",
        data: Array(dailyExpenses.length).fill(totalBudget),
        borderColor: "rgba(255, 119, 0, 0.6)",
        borderDash: [10, 5],
        fill: false,
        pointRadius: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 500,
      easing: "easeInOutQuart",
    },
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: `Expenses for ${selectedMonth.format("MMMM YYYY")}`,
        font: { size: 16 },
      },

      tooltip: {
        enabled: true,
        intersect: false,
        callbacks: {
          title: (tooltipItems) => {
            if (!tooltipItems.length || tooltipItems[0].datasetIndex === 1)
              return "";
            const day = tooltipItems[0].label;
            return `${selectedMonth.format(
              "MMMM"
            )} ${day}, ${selectedMonth.format("YYYY")}`;
          },
          label: (tooltipItem) => {
            if (!tooltipItem || tooltipItem.datasetIndex === 1) return "";

            const expense = tooltipItem.raw;
            const remainingBudget = totalBudget - expense;
            let statusMessage = "";

            if (remainingBudget > totalBudget * 0.2) {
              statusMessage = "✅ Within Budget";
            } else if (remainingBudget > 0) {
              statusMessage = "⚠️ Close to Limit";
            } else {
              statusMessage = "❌ Over Budget!";
            }
            return [
              `💰 Expense: ₹${expense}`,
              `💵 Remaining: ₹${remainingBudget}`,
              statusMessage,
            ];
          },
        },
        filter: (tooltipItem) => tooltipItem.datasetIndex === 0, 
      },
    },
    scales: {
      x: {
        title: { display: true, text: "Days" },
        ticks: {
          autoSkip: true,
          maxRotation: 0,
          minRotation: 0,
          autoSkipPadding: 10,
        },
      },
      y: {
        title: { display: true, text: "Total Expense (₹)" },
        beginAtZero: true,
      },
    },
  };

  return (
    <div>
      {showAlert && (
        <Alert
          message="Budget Exceeded!"
          description="You have exceeded your allocated budget for this month. Consider reviewing your expenses."
          type="error"
          showIcon
          icon={<BsGraphUpArrow />}
          closable
          onClose={() => setShowAlert(false)}
          className="mb-4"
        />
      )}
      <div className="flex items-baseline gap-2 justify-end mt-4">
        <BiSolidCommentError className="text-slate-100" />
        <h3
          className={`font-semibold ${
            totalBudget - dailyExpenses[dailyExpenses.length - 1]?.total < 0
              ? "text-red-500"
              : "gradient-text-green"
          }`}
        >
          Remaining Budget: ₹{" "}
          {totalBudget - (dailyExpenses[dailyExpenses.length - 1]?.total || 0)}
        </h3>
      </div>

      <div className="w-full" style={{ height: "500px" }}>
        <Line ref={chartRef} data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}

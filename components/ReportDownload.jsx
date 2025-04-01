import React, { useRef, useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import { Button } from "antd";
import { Chart, PieController, ArcElement, Tooltip, Legend } from "chart.js";
import { CloudDownloadOutlined } from "@ant-design/icons";

Chart.register(PieController, ArcElement, Tooltip, Legend);
dayjs.extend(utc);

const DownloadReportButton = ({
  budgets,
  incomes,
  expenses,
  selectedMonth,
  user,
}) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const handleDownload = () => {
    setLoading(true);
    const doc = new jsPDF();
    
    const monthString = dayjs.utc(selectedMonth).format("MMMM YYYY");

    const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0);
    const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const remainingAmount = totalBudget - totalExpenses;

    const expensesByCategory = expenses.reduce((acc, expense) => {
      const category = expense.budgetId?.name || "Uncategorized";
      acc[category] = (acc[category] || 0) + expense.amount;
      return acc;
    }, {});

    const categoryPercentages = Object.keys(expensesByCategory).map((category) => {
      const amount = expensesByCategory[category];
      const percentage = ((amount / totalExpenses) * 100).toFixed(1);
      return { category, percentage };
    });

    const addHeader = () => {
      doc.setFillColor("#003366");
      doc.rect(0, 0, doc.internal.pageSize.width, 25, "F");

      const logoPath = "/logo.png";
      doc.addImage(logoPath, "PNG", 5, 3, 15, 15);

      doc.setTextColor("#ffffff");
      doc.setFontSize(14);
      doc.text("Servify's Monthly Export", 25, 13);

      doc.setFontSize(10);
      doc.textWithLink("Visit our website", 25, 18, { url: window.location.origin });

      doc.text(`User: ${user}`, doc.internal.pageSize.width - 70, 13);
    };

    const renderChart = () => {
      const ctx = chartRef.current.getContext("2d");

      // Destroy existing chart instance if it exists
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      // Add percentage to each category label
      const labels = categoryPercentages.map(
        ({ category, percentage }) => `${category} (${percentage}%)`
      );

      // Create a new chart instance and store it in chartInstanceRef
      chartInstanceRef.current = new Chart(ctx, {
        type: "pie",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Expenses by Category",
              data: Object.values(expensesByCategory),
              backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#8D5B4C", "#4CAF50"],
            },
          ],
        },
        options: { responsive: false, animation: false },
      });
    };

    const generatePDF = () => {
      addHeader();
      const marginTop = 40;
      doc.setTextColor("#003366");
      doc.setFontSize(16);
      doc.text(`Monthly Financial Report of ${user}`, 14, marginTop);
      doc.setFontSize(12);
      doc.text(`Report for: ${monthString}`, 14, marginTop + 10);
      doc.text(`Generated on: ${dayjs.utc().format("MMMM D, YYYY")}`, 14, marginTop + 17);

      // Centered chart and remaining budget text
      const chartImage = chartRef.current.toDataURL("image/png");
      const pageWidth = doc.internal.pageSize.width;
      const centerX = (pageWidth - 80) / 2; // Center horizontally
      doc.addImage(chartImage, "PNG", centerX, marginTop + 25, 80, 80);

      doc.setFontSize(12);
      doc.text(`Remaining Budget: ${remainingAmount.toFixed(2)}`, centerX + 10, marginTop + 115);

      let currentY = marginTop + 140;

      const addTable = (title, data, columns, startY, totalAmount) => {
        if (!data || data.length === 0) return startY;

        doc.setFontSize(14);
        doc.text(`${title} (Total: ${totalAmount.toFixed(2)})`, 14, startY); // Show total beside title
        doc.autoTable({
          startY: startY + 5,
          theme: "grid",
          headStyles: { fillColor: "#003366" },
          bodyStyles: { fillColor: "#f0f0f0" },
          alternateRowStyles: { fillColor: "#ffffff" },
          head: [columns.map((col) => col.name)],
          body: data.map((item) =>
            columns.map((col) => {
              const value = col.key.split(".").reduce((acc, key) => acc[key], item);
              return col.key === "createdAt"
                ? dayjs(value).format("MMMM D, YYYY h:mm A")
                : value;
            })
          ),
        });
        return doc.previousAutoTable.finalY + 10;
      };

      currentY = addTable("Budgets", budgets, [{ key: "name", name: "Name" }, { key: "amount", name: "Amount" }], currentY, totalBudget);
      currentY = addTable("Incomes", incomes, [{ key: "name", name: "Name" }, { key: "amount", name: "Amount" }], currentY, totalIncome);
      currentY = addTable(
        "Expenses",
        expenses,
        [
          { key: "name", name: "Name" },
          { key: "amount", name: "Amount" },
          { key: "budgetId.name", name: "Budget Category" },
          { key: "createdAt", name: "Date" },
        ],
        currentY,
        totalExpenses
      );

      doc.save(`${user}'s Financial_Report_${monthString}.pdf`);
      setLoading(false); // Stop loading state
    };

    renderChart();
    setTimeout(generatePDF, 1000);
  };

  return (
    <>
      <canvas ref={chartRef} width="400" height="400" style={{ display: "none" }} />
      <Button
        onClick={handleDownload}
        loading={loading} // Set loading state for button
        color="primary"
        variant="outlined"
        icon={<CloudDownloadOutlined className="text-red-500 scale-125" />}
        className="text-cyan-100"
      >
        PDF
      </Button>
    </>
  );
};

export default DownloadReportButton;

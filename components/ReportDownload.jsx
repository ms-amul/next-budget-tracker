import React from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import dayjs from "dayjs";

const DownloadReportButton = ({ budgets, incomes, expenses, selectedMonth }) => {
  const handleDownload = () => {
    const doc = new jsPDF();
    const monthString = dayjs(selectedMonth).format("MMMM YYYY");

    // Title and Info
    doc.setTextColor("#003366");
    doc.setFontSize(16);
    doc.text("Monthly Financial Report", 14, 20);
    doc.setFontSize(12);
    doc.text(`Report for: ${monthString}`, 14, 30);
    doc.text(`Generated on: ${dayjs().format("MMMM D, YYYY")}`, 14, 37);

    // Function to add table
    const addTable = (title, data, columns, startY) => {
      if (!data || data.length === 0) return startY; // Skip if no data

      doc.setFontSize(14);
      doc.text(title, 14, startY);
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
            return col.key === "createdAt" ? dayjs(value).format("MMMM D, YYYY h:mm A") : value;
          })
        ),
      });
      return doc.previousAutoTable.finalY + 10;
    };

    // Format each data section
    let currentY = 50;
    currentY = addTable(
      "Budgets",
      budgets,
      [
        { key: "name", name: "Name" },
        { key: "amount", name: "Amount" },
      ],
      currentY
    );

    currentY = addTable(
      "Incomes",
      incomes,
      [
        { key: "name", name: "Name" },
        { key: "amount", name: "Amount" },
      ],
      currentY
    );

    currentY = addTable(
      "Expenses",
      expenses,
      [
        { key: "name", name: "Name" },
        { key: "amount", name: "Amount" },
        { key: "budgetId.name", name: "Budget Category" },
        { key: "createdAt", name: "Date" }, // New date column with formatted date
      ],
      currentY
    );

    doc.save(`Financial_Report_${monthString}.pdf`);
  };

  return (
    <button onClick={handleDownload} className="download-button">
      Download Report
    </button>
  );
};

export default DownloadReportButton;

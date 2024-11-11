import React from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import dayjs from "dayjs";
import { Button } from "antd";
import { CloudDownloadOutlined } from "@ant-design/icons";
const DownloadReportButton = ({
  budgets,
  incomes,
  expenses,
  selectedMonth,
  user,
}) => {
  const handleDownload = () => {
    const doc = new jsPDF();
    const monthString = dayjs(selectedMonth).format("MMMM YYYY");

    // Add header for the first page
    const addHeader = () => {
      doc.setFillColor("#003366");
      doc.rect(0, 0, doc.internal.pageSize.width, 20, "F"); // Dark blue header background
      doc.setTextColor("#ffffff");
      doc.setFontSize(14);
      doc.text("Servify's Monthly Export", 14, 13); // Left side header text
      doc.text(`User: ${user}`, doc.internal.pageSize.width - 70, 13); // Right side header text
    };

    // Add document title and basic info with margin for the first page
    const marginTop = 40; // Add a margin to avoid overlap with header
    doc.setTextColor("#003366");
    doc.setFontSize(16);
    doc.text("Monthly Financial Report", 14, marginTop);
    doc.setFontSize(12);
    doc.text(`Report for: ${monthString}`, 14, marginTop + 10);
    doc.text(
      `Generated on: ${dayjs().format("MMMM D, YYYY")}`,
      14,
      marginTop + 17
    );

    // Add header to the first page
    addHeader();

    // Function to add tables
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
            const value = col.key
              .split(".")
              .reduce((acc, key) => acc[key], item);
            return col.key === "createdAt"
              ? dayjs(value).format("MMMM D, YYYY h:mm A")
              : value;
          })
        ),
      });
      return doc.previousAutoTable.finalY + 10;
    };

    let currentY = marginTop + 30; // Start content below the title section
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
        { key: "createdAt", name: "Date" },
      ],
      currentY
    );

    doc.save(`Financial_Report_${monthString}.pdf`);
  };

  return (
    <Button
      onClick={handleDownload}
      color="primary"
      variant="outlined"
      icon={<CloudDownloadOutlined />}
      className="text-cyan-100"
    >
      PDF
    </Button>
  );
};

export default DownloadReportButton;

"use client";
import { Button, DatePicker, Select, Table } from "antd";
import { useEffect, useState } from "react";
import { FaWallet } from "react-icons/fa"; // Default icon if category icon is missing

const { RangePicker } = DatePicker;
const { Option } = Select;

export default function Dashboard({ expenses, getCategories }) {
  
  const [filteredExpenses, setFilteredExpenses] = useState(expenses);
  const [selectedDateRange, setSelectedDateRange] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Date filter logic
  const handleDateFilter = (dates) => {
    if (!dates) {
      setFilteredExpenses(expenses);
      return;
    }

    const [start, end] = dates;
    const filtered = expenses.filter(
      (expense) =>
        new Date(expense.createdAt) >= start &&
        new Date(expense.createdAt) <= end
    );
    setFilteredExpenses(filtered);
    setSelectedDateRange(dates);
  };

  // Budget category filter logic
  const handleCategoryFilter = (categoryId) => {
    if (!categoryId) {
      setFilteredExpenses(expenses);
      return;
    }

    const filtered = expenses.filter(
      (expense) => expense.budgetId._id === categoryId
    );
    setFilteredExpenses(filtered);
    setSelectedCategory(categoryId);
  };

  // Reset filters and show all expenses
  const clearFilters = () => {
    setFilteredExpenses(expenses);
    setSelectedDateRange(null);
    setSelectedCategory(null);
  };

  return (
    <div className="transparent-table">
      <Table
        className="shadow-neumorphic"
        dataSource={filteredExpenses}
        columns={[
          { title: "Name", dataIndex: "name", key: "name" },
          { title: "Amount", dataIndex: "amount", key: "amount" },
          {
            title: (
              <div>
                Date
                <RangePicker
                  onChange={handleDateFilter}
                  value={selectedDateRange}
                  placeholder={["From", "To"]}
                  className="ml-4"
                />
              </div>
            ),
            dataIndex: "createdAt",
            key: "createdAt",
            render: (date) => new Date(date).toLocaleDateString(),
          },
          {
            title: (
              <div>
                Budget Category
                <Select
                  placeholder="Select Category"
                  style={{ width: 150, marginLeft: "10px" }}
                  onChange={handleCategoryFilter}
                  value={selectedCategory}
                  allowClear
                >
                  {getCategories().map((category) => (
                    <Option key={category._id} value={category._id} className="flex items-center">
                      {category.icon ? category.icon : <FaWallet />}{" "}
                      {category.name}
                    </Option>
                  ))}
                </Select>
              </div>
            ),
            dataIndex: "budgetId",
            key: "budgetId",
            render: (budgetId) => (
              <div className="flex items-center space-x-2">
                {budgetId.icon ? budgetId.icon : <FaWallet />}{" "}
                {/* Render icon */}
                <span>{budgetId.name}</span>
              </div>
            ),
          },
          {
            title: "Action",
            key: "action",
            render: (_, record) => (
              <div className="space-x-2">
                <Button onClick={() => handleOpenModal("expense", record)}>
                  Edit
                </Button>
                <Button danger>Delete</Button>
              </div>
            ),
          },
        ]}
        rowKey="_id"
      />
      <div className="mt-4">
        <Button onClick={clearFilters}>Reset Filters</Button>
      </div>
    </div>
  );
}

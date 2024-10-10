"use client";
import {
  Button,
  DatePicker,
  Empty,
  Select,
  Table,
  message,
  Popconfirm,
} from "antd";
import { useEffect, useState } from "react";
import { FaWallet } from "react-icons/fa"; // Default icon if category icon is missing
import { AlertTwoTone } from "@ant-design/icons";
import dayjs from "dayjs"; // Assuming dayjs is installed for date handling
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin5Fill } from "react-icons/ri";

const { MonthPicker } = DatePicker;
const { Option } = Select;

export default function Dashboard({
  expenses,
  getCategories,
  addExpense,
  fetchData,
}) {
  const currentMonth = dayjs().startOf("month");

  const [filteredExpenses, setFilteredExpenses] = useState(expenses);
  const [selectedMonth, setSelectedMonth] = useState(dayjs()); // Default to current month
  const [selectedCategory, setSelectedCategory] = useState(null);
  const isCurrentMonth = selectedMonth.isSame(currentMonth, "month");

  const deleteExpense = async (id) => {
    const res = await fetch(`/api/expense`, {
      method: "DELETE",
      body: JSON.stringify({ id }),
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) {
      message.success("Deleted the expense");
      fetchData();
    } else {
      message.error("Failed to delete expense. Please try again.");
    }
  };

  // Helper function to filter expenses by selected month
  const filterByMonth = (month) => {
    if (!month) {
      setFilteredExpenses(expenses);
      return;
    }

    const filtered = expenses.filter(
      (expense) =>
        dayjs(expense.createdAt).format("MMMM YYYY") ===
        month.format("MMMM YYYY")
    );
    setFilteredExpenses(filtered);
  };

  // Handle month filter change
  const handleMonthChange = (date) => {
    setSelectedMonth(date);
    filterByMonth(date);
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
    setSelectedMonth(dayjs());
    filterByMonth(dayjs());
    setSelectedCategory(null);
  };

  useEffect(() => {
    setSelectedMonth(dayjs());
    filterByMonth(dayjs());
    setSelectedCategory(null);
  }, [expenses]);

  return (
    <div className="table-container mx-auto custom-table">
      <div className="my-4 text-right">
        <Button
          onClick={clearFilters}
          variant="filled"
          color="danger"
          type="dashed"
        >
          <AlertTwoTone />
          Reset Filters
        </Button>
      </div>
      <Table
        dataSource={filteredExpenses}
        columns={[
          { title: "Name", dataIndex: "name", key: "name" },
          { title: "Amount", dataIndex: "amount", key: "amount" },
          {
            title: (
              <div>
                <Select
                  placeholder="Select Category"
                  style={{ width: 150, marginLeft: "10px" }}
                  onChange={handleCategoryFilter}
                  value={selectedCategory}
                  allowClear
                >
                  {getCategories(selectedMonth).map((category) => (
                    <Option
                      key={category._id}
                      value={category._id}
                      className="flex items-center"
                    >
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
                <span>{budgetId.name}</span>
              </div>
            ),
          },
          {
            title: (
              <div className="">
                <MonthPicker
                  onChange={handleMonthChange}
                  value={selectedMonth}
                  placeholder="Select Month"
                  allowClear={false}
                  disabledDate={(current) =>
                    current && current > dayjs().endOf("month")
                  }
                />
              </div>
            ),
            key: "date-actions",
            render: (_, record) => (
              <div className="flex gap-2">
                {/* Date display */}
                <span className="text-white bg-cyan-900 text-xs font-normal p-2 rounded-full">
                  {new Date(record.createdAt).toLocaleDateString()}
                </span>
                {/* Action buttons */}
                <div className="space-x-2">
                  <Button onClick={() => addExpense(record)}>
                    <FaEdit />
                  </Button>
                  <Popconfirm
                    title="Are you sure you want to delete this Expense?"
                    onConfirm={() => deleteExpense(record._id)} // Confirm delete
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button danger>
                      <RiDeleteBin5Fill />
                    </Button>
                  </Popconfirm>
                </div>
              </div>
            ),
          },
        ]}
        rowKey="_id"
        scroll={{ x: "max-content" }}
        className="shadow-md"
        locale={{
          emptyText: (
            <Empty
              description={
                <div className="text-center">
                  <p className="mb-3 gradient-text-blue">
                    No expenses found for {selectedMonth.format("MMMM YYYY")} .
                  </p>
                  {isCurrentMonth && (
                    <Button
                      type="primary"
                      shape="round"
                      onClick={() => addExpense()}
                    >
                      Add Expense
                    </Button>
                  )}
                </div>
              }
            />
          ),
        }}
      />
    </div>
  );
}

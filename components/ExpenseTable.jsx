"use client";
import {
  Button,
  DatePicker,
  Empty,
  Select,
  Table,
  message,
  Popconfirm,
  Input,
} from "antd";
import { useEffect, useState } from "react";
import { FaWallet } from "react-icons/fa"; // Default icon if category icon is missing
import { AlertTwoTone } from "@ant-design/icons";
import dayjs from "dayjs";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin5Fill } from "react-icons/ri";

const { MonthPicker } = DatePicker;
const { Option } = Select;

export default function Dashboard({
  expenses,
  getCategories,
  addExpense,
  fetchData,
  selectedMonth,
  setSelectedMonth
}) {
  const currentMonth = dayjs().startOf("month");

  const [filteredExpenses, setFilteredExpenses] = useState(expenses);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchText, setSearchText] = useState(""); // State to track search input
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

  // Handle month filter change
  const handleMonthChange = (date) => {
    setSelectedMonth(date);
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

    // Sort the filtered expenses by createdAt in descending order
    const sorted = filtered.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    setFilteredExpenses(sorted);
    setSelectedCategory(categoryId);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    const text = e.target.value;
    setSearchText(text);

    const filtered = expenses.filter((expense) =>
      expense.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredExpenses(filtered);
  };

  // Reset filters and show all expenses
  const clearFilters = () => {
    setSelectedMonth(dayjs());
    setSelectedCategory(null);
    setSearchText("");
  };

  useEffect(() => {
    const sortedExpenses = expenses.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    setFilteredExpenses(sortedExpenses);
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
          {
            title: (
              <div>
                <Input
                  placeholder="Search by name"
                  value={searchText}
                  onChange={handleSearchChange}
                  className="w-[120px] md:w-auto"
                />
              </div>
            ),
            dataIndex: "name",
            key: "name",
            fixed: "left",
          },
          {
            title: (
              <div>
                Amount (₹{" "}
                {filteredExpenses.reduce(
                  (total, expense) => total + (expense.amount || 0),
                  0
                ).toFixed(2)}
                )
              </div>
            ),
            dataIndex: "amount",
            key: "amount",
            render: (amount) => `₹ ${amount.toFixed(2)}`,
          },
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
                  inputReadOnly={true}
                  disabledDate={(current) =>
                    current && (current > dayjs().endOf("month") || current < dayjs("2024-09-01"))
                  }
                />
              </div>
            ),
            key: "date-actions",
            render: (_, record) => (
              <div className="flex gap-2">
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
                    No expenses found for {selectedMonth.format("MMMM YYYY")}.
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

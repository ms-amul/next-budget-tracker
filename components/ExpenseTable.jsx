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
  Tooltip,
} from "antd";
import { useEffect, useState } from "react";
import { FaWallet, FaEdit } from "react-icons/fa";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { AlertTwoTone } from "@ant-design/icons";
import dayjs from "dayjs";

const { MonthPicker } = DatePicker;
const { Option } = Select;

export default function Dashboard({
  expenses,
  getCategories,
  addExpense,
  fetchData,
  selectedMonth,
  setSelectedMonth,
}) {
  const [filteredExpenses, setFilteredExpenses] = useState(expenses);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const sortedExpenses = expenses.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    setFilteredExpenses(sortedExpenses);
  }, [expenses]);

  const deleteExpense = async (id) => {
    const res = await fetch(`/api/expense`, {
      method: "DELETE",
      body: JSON.stringify({ id }),
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) {
      message.success("Deleted successfully");
      fetchData();
    } else {
      message.error("Failed to delete. Try again.");
    }
  };

  const handleMonthChange = (date) => setSelectedMonth(date);
  const handleCategoryFilter = (categoryId) => {
    setSelectedCategory(categoryId);
    setFilteredExpenses(
      categoryId
        ? expenses.filter((e) => e.budgetId._id === categoryId)
        : expenses
    );
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
    setFilteredExpenses(
      expenses.filter((expense) =>
        expense.name.toLowerCase().includes(e.target.value.toLowerCase())
      )
    );
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setSearchText("");
    setFilteredExpenses(expenses);
  };

  return (
    <div className="w-100 mx-auto">
      <div className="flex flex-wrap gap-3 justify-between items-center mb-2 p-4 rounded-lg shadow-lg bg-slate-900 bg-opacity-75">
        <Input
          placeholder="🔍 Search by name"
          value={searchText}
          onChange={handleSearchChange}
          className="w-full sm:w-auto"
          allowClear
        />
        <Select
          placeholder="📂 Select Category"
          style={{ width: 180 }}
          onChange={handleCategoryFilter}
          value={selectedCategory}
          allowClear
        >
          {getCategories(selectedMonth).map((category) => (
            <Option key={category._id} value={category._id}>
              {category.icon || <FaWallet />} {category.name}
            </Option>
          ))}
        </Select>

        <MonthPicker
          onChange={handleMonthChange}
          value={selectedMonth}
          placeholder="📆 Select Month"
          allowClear={false}
          inputReadOnly
          disabledDate={(current) =>
            current &&
            (current > dayjs().endOf("month") || current < dayjs("2024-09-01"))
          }
        />
        <Button type="dashed" onClick={clearFilters} className="text-white">
          <AlertTwoTone /> Reset
        </Button>
      </div>

      <Table
        dataSource={filteredExpenses}
        pagination={{ pageSize: 6 }}
        rowKey="_id"
        scroll={{ x: "max-content" }}
        bordered
        className="shadow-lg bg-gray-900 bg-opacity-75 rounded-lg"
        columns={[
          {
            title: "Expense Name",
            dataIndex: "name",
            key: "name",
            fixed: "left",
            width: 180,
            render: (text) => (
              <Tooltip title={text}>
                <span className="truncate max-w-[150px] block">{text}</span>
              </Tooltip>
            ),
          },
          {
            title: (
              <span>
                Amount (₹{" "}
                {filteredExpenses
                  .reduce((total, e) => total + (e.amount || 0), 0)
                  .toFixed(2)}
                )
              </span>
            ),
            dataIndex: "amount",
            key: "amount",
            sorter: (a, b) => a.amount - b.amount,
            render: (amount) => `₹ ${amount.toFixed(2)}`,
          },
          {
            title: "Category",
            dataIndex: "budgetId",
            key: "budgetId",
            render: (budget) => (
              <div className="flex items-center space-x-2">
                {budget.icon || <FaWallet />} <span>{budget.name}</span>
              </div>
            ),
          },
          {
            title: "Date",
            key: "createdAt",
            render: (_, record) => (
              <span className="text-sm text-gray-300">
                {dayjs(record.createdAt).format("DD MMM, YYYY")}
              </span>
            ),
          },
          {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
              <div className="flex gap-2">
                <Button
                  type="text"
                  icon={
                    <FaEdit className="text-blue-400 hover:text-blue-600 transition duration-300 transform hover:scale-110" />
                  }
                  onClick={() => addExpense(record)}
                />
                <Popconfirm
                  title="Are you sure to delete this expense?"
                  onConfirm={() => deleteExpense(record._id)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button
                    type="text"
                    danger
                    icon={
                      <RiDeleteBin5Fill className="text-red-400 hover:text-red-600 transition duration-300 transform hover:scale-110" />
                    }
                  />
                </Popconfirm>
              </div>
            ),
          },
        ]}
        locale={{
          emptyText: (
            <Empty
              description={
                <div className="text-center text-gray-400">
                  <p className="mb-3">
                    No expenses found for {selectedMonth.format("MMMM YYYY")}.
                  </p>
                  <Button
                    type="primary"
                    shape="round"
                    onClick={() => addExpense()}
                  >
                    Add Expense
                  </Button>
                </div>
              }
            />
          ),
        }}
      />
    </div>
  );
}

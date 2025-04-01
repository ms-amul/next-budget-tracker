"use client";

import { Form, Input, Button, Select, message } from "antd";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';

export default function Expense({
  getCategories,
  fetchData,
  editData,
  isCurrentMonth,
  switchToCurrent,
  handleCloseModal
}) {
  dayjs.extend(utc);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchCategories = async () => {
      const currentMonth = dayjs.utc();
      const budgetCategories = await getCategories(currentMonth);
      setCategories(budgetCategories);
    };
    fetchCategories();
  }, [getCategories]);

  useEffect(() => {
    if (editData) {
      form.setFieldsValue({
        name: editData.name,
        amount: editData.amount,
        categoryId: editData.budgetId._id,
      });
    } else {
      form.setFieldsValue({
        name: "",
        amount: "",
        categoryId: "",
      });
    }
  }, [editData, form]);

  // Form submit handler
  const onFinish = async (values) => {
    const expenseData = {
      name: values.name,
      amount: values.amount,
      budgetId: values.categoryId,
    };

    setLoading(true); // Start loading

    try {
      const method = editData ? "PUT" : "POST";
      if (editData) {
        expenseData.id = editData._id;
      }

      const res = await fetch("/api/expense", {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(expenseData),
      });

      if (res.ok) {
        console.log(res);
        message.success(
          editData
            ? "Expense updated successfully!"
            : "Expense added successfully!"
        ); // Success notification
        form.resetFields();
        fetchData();
      } else {
        message.error("Failed to save expense. Please try again.");
      }
    } catch (error) {
      message.error("An error occurred. Please try again.");
      console.error("Error submitting expense:", error);
    } finally {
      setLoading(false);
      handleCloseModal();
    }
  };

  return (
    <>
      {!isCurrentMonth && !editData ? (
        <div className="flex flex-col items-center gap-1 text-center p-2 mt-4">
          <h3 className="gradient-text-blue text-lg">
            Can't add expenses to previous months. Switch to the current month
            to add expenses.
          </h3>
          <Button type="primary" onClick={() => switchToCurrent()}>
            Switch to Current Month
          </Button>
        </div>
      ) : (
        <div className="">
          <h1 className="gradient-text-blue text-xl font-bold mb-6">
            {editData ? "Edit Your Expense" : "Add Your Expense"}{" "}
          </h1>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            className="space-y-4"
          >
            {/* Expense Amount */}
            <Form.Item
              label="Amount"
              name="amount"
              rules={[{ required: true, message: "Please input the amount!" }]}
            >
              <Input type="number" placeholder="Enter amount" prefix="₹" />
            </Form.Item>

            {/* Expense Name */}
            <Form.Item
              label="Expense Name"
              name="name"
              rules={[
                { required: true, message: "Please input the expense name!" },
              ]}
            >
              <Input placeholder="Enter expense name" />
            </Form.Item>

            {/* Budget Category Dropdown */}
            <Form.Item
              label="Category"
              name="categoryId"
              rules={[{ required: true, message: "Please select a category!" }]}
            >
              <Select placeholder="Select budget category">
                {categories.map((category) => (
                  <Select.Option key={category._id} value={category._id}>
                    {category.icon + " " + category.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="bg-gradient-to-r from-blue-500 to-purple-600"
                loading={loading} // Shows a loader on the button when submitting
              >
                {loading
                  ? "Submitting..."
                  : editData
                  ? "Edit Expense"
                  : "Add Expense"}{" "}
                {/* Dynamic Button Text */}
              </Button>
            </Form.Item>
          </Form>
        </div>
      )}
    </>
  );
}

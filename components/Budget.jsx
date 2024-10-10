"use client";

import { Form, Input, Button, message } from "antd";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// Dynamically import the EmojiPicker to ensure it's client-side only
const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });

export default function BudgetForm({ fetchData, editData }) {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm(); // To control the form instance
  const [selectedEmoji, setSelectedEmoji] = useState(""); // State to store selected emoji
  const [showPicker, setShowPicker] = useState(false); // To toggle the emoji picker

  // Populate the form with editData if provided
  useEffect(() => {
    if (editData) {
      form.setFieldsValue({
        name: editData.name,
        amount: editData.amount,
        icon: editData.icon, // Set the existing icon/emoji
      });
      setSelectedEmoji(editData.icon); // Prepopulate emoji selection
    } else {
      form.setFieldsValue({
        name: "",
        amount: "",
        icon: "",
      });
      setSelectedEmoji(""); // Reset emoji selection
    }
  }, [editData, form]);

  // Emoji select handler
  const onEmojiClick = (emojiObject) => {
    setSelectedEmoji(emojiObject.emoji); // Store the selected emoji
    setShowPicker(false); // Hide picker after selection
  };

  // Form submit handler
  const onFinish = async (values) => {
    const budgetData = {
      name: values.name,
      amount: values.amount,
      icon: selectedEmoji, // Use the selected emoji as the icon
    };

    if (!selectedEmoji) {
      message.error("Please select an emoji for the budget icon.");
      return;
    }

    setLoading(true);

    try {
      const method = editData ? "PUT" : "POST"; // If editData exists, use PUT, otherwise POST
      if (editData) {
        budgetData.id = editData._id; // Add the budget ID if editing
      }

      const res = await fetch("/api/budget", {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(budgetData),
      });

      if (res.ok) {
        message.success(editData ? "Budget updated successfully!" : "Budget created successfully!"); // Success notification
        form.resetFields(); // Clear form after successful submission
        setSelectedEmoji(""); // Clear emoji selection
        fetchData(); // Fetch updated budget data after successful submission
      } else {
        message.error("Failed to save budget. Please try again.");
      }
    } catch (error) {
      message.error("An error occurred. Please try again.");
      console.error("Error submitting budget:", error);
    } finally {
      setLoading(false); // Stop loading after submission
    }
  };

  return (
    <div className="container mx-auto max-w-md p-6 shadow-lg bg-light-bg rounded-lg">
      <h1 className="gradient-text-blue text-xl font-semibold mb-6">
        {editData ? "Edit Your Budget" : "Create a New Budget"} {/* Dynamic Title */}
      </h1>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="space-y-4"
      >
        {/* Budget Name */}
        <Form.Item
          label="Budget Name"
          name="name"
          rules={[{ required: true, message: "Please input the budget name!" }]}
        >
          <Input placeholder="Enter budget name" />
        </Form.Item>

        {/* Budget Amount */}
        <Form.Item
          label="Amount"
          name="amount"
          rules={[{ required: true, message: "Please input the amount!" }]}
        >
          <Input type="number" placeholder="Enter amount" prefix="₹" />
        </Form.Item>

        {/* Emoji Picker for Budget Icon */}
        <Form.Item label="Icon" name="icon">
          <div className="flex items-center space-x-4">
            <Input
              value={selectedEmoji}
              placeholder="Select an emoji"
              readOnly
              onClick={() => setShowPicker(!showPicker)}
            />
            <Button onClick={() => setShowPicker(!showPicker)}>
              {showPicker ? "Hide Emoji Picker" : "Show Emoji Picker"}
            </Button>
          </div>
          {showPicker && (
            <div className="mt-2">
              <EmojiPicker onEmojiClick={onEmojiClick} />
            </div>
          )}
        </Form.Item>

        {/* Submit Button */}
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600"
            loading={loading} // Shows a loader on the button when submitting
          >
            {loading ? "Submitting..." : editData ? "Edit Budget" : "Create Budget"} {/* Dynamic Button Text */}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

"use client";

import { Form, Input, Button, message } from "antd";
import { useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import the EmojiPicker to ensure it's client-side only
const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });

export default function BudgetForm() {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm(); // To control the form instance
  const [selectedEmoji, setSelectedEmoji] = useState(""); // State to store selected emoji
  const [showPicker, setShowPicker] = useState(false); // To toggle the emoji picker

  // Emoji select handler
  const onEmojiClick = (emojiObject, event) => {
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
      const res = await fetch("/api/budget", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(budgetData),
      });

      if (res.ok) {
        message.success("Budget created successfully!"); // Success notification
        form.resetFields(); // Clear form after successful submission
        setSelectedEmoji(""); // Clear emoji selection
      } else {
        message.error("Failed to create budget. Please try again.");
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
        Create a New Budget
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
            {loading ? "Submitting..." : "Create Budget"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
"use client";
import { Table } from "antd";

export default function BudgetTable({ budgets }) {
  const columns = [
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Limit",
      dataIndex: "limit",
      key: "limit",
      render: (text) => `$${text.toFixed(2)}`,
    },
    {
      title: "Spent",
      dataIndex: "spent",
      key: "spent",
      render: (text) => `$${text.toFixed(2)}`,
    },
    {
      title: "Remaining",
      key: "remaining",
      render: (_, record) => {
        const remaining = record.limit - record.spent;
        return `$${remaining.toFixed(2)}`;
      },
    },
  ];

  return <Table dataSource={budgets} columns={columns} rowKey="_id" />;
}

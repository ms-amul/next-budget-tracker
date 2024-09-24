"use client"
import { Button, Table } from "antd";
import { useState } from "react";

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);

  return (
    <div className="transparent-table">
      <Table
        dataSource={expenses}
        columns={[
          { title: "Name", dataIndex: "name", key: "name" },
          { title: "Amount", dataIndex: "amount", key: "amount" },
          {
            title: "Date",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (date) => new Date(date).toLocaleDateString(),
            filters: [
              { text: "Last 7 Days", value: "7" },
              { text: "Last 30 Days", value: "30" },
            ],
            onFilter: (value, record) => {
              const daysAgo = new Date();
              daysAgo.setDate(daysAgo.getDate() - value);
              return new Date(record.createdAt) >= daysAgo;
            },
          },
          {
            title: "Action",
            key: "action",
            render: (_, record) => (
              <div className="space-x-2">
                <Button onClick={() => handleOpenModal("expense", record)}>Edit</Button>
                <Button danger>Delete</Button>
              </div>
            ),
          },
        ]}
        rowKey="_id"
      />
      </div>
  );
}

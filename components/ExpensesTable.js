'use client';
import { Table } from 'antd';

export default function ExpenseTable({ expenses }) {
  const columns = [
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (text) => `$${text.toFixed(2)}`,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
  ];

  return <Table dataSource={expenses} columns={columns} rowKey="id" />;
}

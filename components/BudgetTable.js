'use client';
import { Table } from 'antd';

export default function BudgetTable({ budgets }) {
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (text) => `$${text.toFixed(2)}`,
    },
    {
      title: 'Remaining',
      dataIndex: 'remaining',
      key: 'remaining',
      render: (text) => `$${text.toFixed(2)}`,
    },
  ];

  return <Table dataSource={budgets} columns={columns} rowKey="id" />;
}

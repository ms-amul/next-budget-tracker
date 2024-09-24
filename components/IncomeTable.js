'use client';
import { Table } from 'antd';

export default function IncomeTable({ incomes }) {
  const columns = [
    {
      title: 'Source',
      dataIndex: 'source',
      key: 'source',
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

  return <Table dataSource={incomes} columns={columns} rowKey="id" />;
}

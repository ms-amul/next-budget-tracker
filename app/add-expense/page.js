import { Form, Input, Button, Select } from 'antd';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function AddExpense() {
  const [form] = Form.useForm();
  const [budgets, setBudgets] = useState([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchBudgets() {
      const res = await fetch('/api/budget');
      setBudgets(await res.json());
    }
    fetchBudgets();
  }, []);

  const onFinish = async (values) => {
    const res = await fetch('/api/expense', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    });

    if (res.ok) {
      router.push('/dashboard');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add Expense</h1>
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item label="Expense Name" name="name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Amount" name="amount" rules={[{ required: true }]}>
          <Input type="number" />
        </Form.Item>
        <Form.Item label="Budget Category" name="budgetId" rules={[{ required: true }]}>
          <Select>
            {budgets.map((budget) => (
              <Select.Option key={budget._id} value={budget._id}>
                {budget.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Button type="primary" htmlType="submit">
          Add Expense
        </Button>
      </Form>
    </div>
  );
}

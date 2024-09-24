import { Form, Input, Button } from 'antd';
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function AddIncome() {
  const [form] = Form.useForm();
  const router = useRouter();

  const onFinish = async (values) => {
    const res = await fetch('/api/income', {
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
      <h1 className="text-2xl font-bold mb-4">Add Income</h1>
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item label="Income Source" name="name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Amount" name="amount" rules={[{ required: true }]}>
          <Input type="number" />
        </Form.Item>
        <Form.Item label="Icon" name="icon">
          <Input />
        </Form.Item>
        <Button type="primary" htmlType="submit">
          Add Income
        </Button>
      </Form>
    </div>
  );
}

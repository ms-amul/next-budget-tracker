import { useState } from 'react';
import { Form, Input, Button } from 'antd';
import EmojiPicker from 'emoji-picker-react';

export default function AddBudget() {
  const [form] = Form.useForm();
  const [selectedEmoji, setSelectedEmoji] = useState('');

  const onEmojiClick = (event, emojiObject) => {
    setSelectedEmoji(emojiObject.emoji);
  };

  const onFinish = async (values) => {
    values.icon = selectedEmoji;
    // Handle the rest of the form submission...
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add Budget</h1>
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item label="Budget Name" name="name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Amount" name="amount" rules={[{ required: true }]}>
          <Input type="number" />
        </Form.Item>
        <Form.Item label="Category Icon">
          <EmojiPicker onEmojiClick={onEmojiClick} />
        </Form.Item>
        <p>Selected Icon: {selectedEmoji}</p>
        <Button type="primary" htmlType="submit">
          Add Budget
        </Button>
      </Form>
    </div>
  );
}

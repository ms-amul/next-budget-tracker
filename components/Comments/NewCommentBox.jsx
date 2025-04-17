"use client";
import { Input, Button } from "antd";
import { FaTelegramPlane } from "react-icons/fa";

export default function NewCommentBox({ newComment, setNewComment, onPost }) {
  return (
    <>
    <div className="mb-6 mt-6">
      <div className="flex items-end rounded-3xl border border-gray-300 px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-400 transition bg-black">
        <Input.TextArea
          autoSize={{ minRows: 1, maxRows: 5 }}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          variant={false}
          className="flex-1 resize-none focus:ring-0 focus:outline-none text-white bg-transparent"
        />
        <Button
          type="primary"
          shape="circle"
          icon={<FaTelegramPlane className="text-white text-xl" />}
          onClick={onPost}
          className="ml-2 shadow-md flex items-center"
        />
      </div>
    </div>
    </>
  );
}

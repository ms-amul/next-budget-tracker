"use client";
import { Button, Input, Popconfirm, Tooltip } from "antd";
import { useSession } from "next-auth/react";
import React, { useCallback, useState } from "react";
import { AiOutlineClockCircle } from "react-icons/ai";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import { FaTelegramPlane } from "react-icons/fa";
import { MdAdminPanelSettings } from "react-icons/md";
import { MdDelete } from "react-icons/md";

const adminEmails = [
  "rajgopalhota@gmail.com",
  "amulyatripathy98@gmail.com",
  "2100032351cseh@gmail.com",
];

const { TextArea } = Input;

const CommentBox = React.memo(
  ({ comment, fetchReplies, postReply, deleteComment }) => {
    const [replies, setReplies] = useState([]);
    const [showReplies, setShowReplies] = useState(false);
    const [replyText, setReplyText] = useState("");

    const { data: session } = useSession();

    const toggleReplies = useCallback(async () => {
      if (!showReplies) {
        const data = await fetchReplies(comment._id);
        setReplies(data);
      }
      setShowReplies(!showReplies);
    }, [showReplies, comment._id, fetchReplies]);

    const handleReply = async () => {
      if (!replyText.trim()) return;
      const reply = await postReply(replyText, comment._id);
      setReplies([reply, ...replies]);
      setReplyText("");
      setShowReplies(true);
    };

    const isAdmin = adminEmails.includes(session?.user?.email);
    const isCommentOwner = comment.userId?._id === session?.user?.id;

    const confirmDelete = () => {
      deleteComment(comment._id);
    };

    return (
      <div className="my-4 qcard commentscard p-4 rounded-lg shadow-lg">
        <div className="flex flex-col gap-3 group">
          <div className="flex items-start gap-3">
            <img
              src={comment.userId?.image || session?.user?.image}
              alt="User Avatar"
              className="w-12 h-12 rounded-lg border border-blue-500 shadow-md object-cover"
            />
            <div className="flex-1 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-blue-400">
                  {comment.userId?.name || session?.user?.name}
                </span>
                {comment.admin && (
                  <Tooltip
                    title={`${
                      comment.userId?.name || session?.user?.name
                    } is an admin of this site and a verified member`}
                  >
                    <span className="bg-lime-900/60 text-lime-300 text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 font-medium shadow-sm border border-lime-800 cursor-default">
                      <MdAdminPanelSettings className="text-lime-400 text-xs" />
                      Admin
                    </span>
                  </Tooltip>
                )}
              </div>

              <div className="text-sm text-gray-300 whitespace-pre-line">
                {comment.content}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mt-2">
            <div className="flex items-center gap-3">
              <div className="bg-blue-900/70 text-blue-300 text-[11px] px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm backdrop-blur-md border border-blue-800">
                <AiOutlineClockCircle className="text-xs" />
                {new Date(comment.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>

            {(isAdmin || isCommentOwner) && (
              <Popconfirm
                title="Are you sure you want to delete this comment?"
                onConfirm={confirmDelete}
                okText="Yes"
                cancelText="No"
              >
                <button className="text-red-400 hover:text-red-300 transition p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500">
                  <MdDelete className="text-lg" />
                </button>
              </Popconfirm>
            )}
          </div>

          {!comment.parentId && (
            <div className="flex justify-end items-center gap-3 mt-2">
              <Tooltip title={showReplies ? "Hide Replies" : "Reply"}>
                <Button
                  type="text"
                  size="small"
                  onClick={toggleReplies}
                  className="text-blue-400 hover:text-blue-300 flex items-center gap-1 transition"
                >
                  {showReplies ? <BsChevronUp /> : <BsChevronDown />}
                  {showReplies ? "Hide Replies" : "Reply"}
                </Button>
              </Tooltip>
            </div>
          )}

          {showReplies && !comment.parentId && (
            <div className="mt-3">
              <div className="flex items-center gap-3 mb-2">
                <img
                  src={session?.user?.image}
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full border border-blue-500 shadow-md object-cover"
                />
                <TextArea
                  autoSize={{ minRows: 1, maxRows: 4 }}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write a reply..."
                  className="flex-1 resize-none focus:ring-0 focus:outline-none text-white bg-transparent"
                />
                <Tooltip title="Send Reply">
                  <Button
                    type="primary"
                    shape="circle"
                    icon={<FaTelegramPlane className="text-white text-xl" />}
                    onClick={handleReply}
                    className="ml-2 shadow-md flex items-center"
                  />
                </Tooltip>
              </div>
            </div>
          )}

          {showReplies && replies.length > 0 && (
            <div className="mt-3 pl-4">
              {replies.map((reply) => (
                <CommentBox
                  key={reply._id}
                  comment={reply}
                  fetchReplies={fetchReplies}
                  postReply={postReply}
                  deleteComment={deleteComment}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
);

export default CommentBox;

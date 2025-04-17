"use client";
import { Button, Input, Tooltip } from "antd";
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

    return (
      <div className={`my-6 transition-all duration-300 ease-in-out`}>
        <div className="flex items-start gap-3 group">
          <img
            src={comment.userId?.image || session?.user?.image}
            alt="User Avatar"
            className="w-10 h-10 rounded-full border border-blue-500 shadow-md"
          />

          <div className="flex-1 bg-[#1c1f26] text-white rounded-2xl px-4 py-3 shadow-lg relative transition duration-300 ease-in-out hover:shadow-xl">
            <div className="absolute top-2 right-4 flex items-center gap-2">
              <div className="bg-blue-900/70 text-blue-300 text-[11px] px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm backdrop-blur-md border border-blue-800">
                <AiOutlineClockCircle className="text-xs" />
                {new Date(comment.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>

              {/* Show delete button if the user is an admin or the comment's user */}
              {(isAdmin || isCommentOwner) && (
                <Tooltip title="Delete Comment">
                  <button
                    onClick={() => deleteComment(comment._id)}
                    className="text-red-400 hover:text-red-300 transition p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <MdDelete className="text-lg" />
                  </button>
                </Tooltip>
              )}
            </div>

            <div className="text-sm font-semibold text-blue-400 mb-1 flex items-center gap-2">
              {comment.userId?.name || session?.user?.name}
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

            <div className="text-gray-300 text-sm whitespace-pre-line">
              {comment.content}
            </div>

            {!comment.parentId && (
              <div className="flex justify-end items-center gap-3 mt-3">
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
              <div className="mt-3 transition-all">
                <div className="flex items-end rounded-3xl border border-gray-700 px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 transition bg-black">
                  <TextArea
                    autoSize={{ minRows: 1, maxRows: 4 }}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write a reply..."
                    variant={false}
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
              <div className="mt-4">
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
      </div>
    );
  }
);

export default CommentBox;

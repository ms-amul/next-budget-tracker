import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongo";
import Comment from "@/models/Comment";
import User from "@/models/User";
import { getServerSession } from "next-auth/next";

const adminEmails = [
  "rajgopalhota@gmail.com",
  "amulyatripathy98@gmail.com",
  "2100032351cseh@gmail.com",
];

export async function POST(req) {
  try {
    await connectMongo();
    const session = await getServerSession(req);

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { text, parentId } = await req.json();
    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    if (parentId) {
      const parentComment = await Comment.findById(parentId);
      if (!parentComment || parentComment.parentId) {
        return NextResponse.json(
          { error: "Cannot reply to a reply" },
          { status: 400 }
        );
      }
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const newComment = await Comment.create({
      content: text,
      parentId: parentId || null,
      userId: user._id,
    });

    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error("Error in POST:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    await connectMongo();
    const session = await getServerSession(req);

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const parentId = searchParams.get("parentId") || null;
    const limit = parseInt(searchParams.get("limit") || "5");
    const skip = parseInt(searchParams.get("skip") || "0");

    const query = { parentId };

    const comments = await Comment.find(query)
      .populate("userId", "_id name image email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const filtered = comments.map((comment) => {
      const isAdmin = adminEmails.includes(comment.userId?.email);
      return {
        ...comment.toObject(),
        admin: isAdmin,
        userId: {
          _id: comment.userId?._id,
          name: comment.userId?.name,
          image: comment.userId?.image,
        },
      };
    });

    return NextResponse.json(filtered || [], { status: 200 });
  } catch (error) {
    console.error("Error in GET:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await connectMongo();
    const session = await getServerSession(req);

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { commentId } = await req.json();

    if (!commentId) {
      return NextResponse.json(
        { error: "Comment ID is required" },
        { status: 400 }
      );
    }

    const comment = await Comment.findById(commentId).populate("userId");

    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    if (
      comment.userId._id.toString() !== user._id.toString() &&
      !adminEmails.includes(session.user.email)
    ) {
      return NextResponse.json(
        { error: "You do not have permission to delete this comment" },
        { status: 403 }
      );
    }

    if (!comment.parentId) {
      await Comment.deleteMany({ parentId: commentId });
    }

    await Comment.findByIdAndDelete(commentId);

    return NextResponse.json(
      { message: "Comment deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in DELETE:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

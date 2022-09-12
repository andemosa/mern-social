import { Model, Schema, model, Types } from "mongoose";
import { IUser } from "./user.model";

interface IComment {
  text: string;
  postedBy: Types.ObjectId;
}

const commentSchema = new Schema<IComment>(
  {
    text: { type: String, required: true },
    postedBy: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

interface IPost {
  text: string;
  photo: {
    data: any;
    contentType: string;
  };
  comments: Types.DocumentArray<IComment>;
  likes: Types.DocumentArray<IUser>;
  postedBy: Types.ObjectId;
}

const postSchema = new Schema<IPost>(
  {
    text: { type: String, required: true },
    photo: {
      data: Buffer,
      contentType: String,
    },
    comments: [commentSchema],
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    postedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

const Comment = model<IComment>("Comment", commentSchema);
const Post = model<IPost>("Post", postSchema);

export { Comment, Post, IComment, IPost };

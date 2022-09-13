import { NextFunction, Request, Response } from "express";
import formidable from "formidable";
import fs from "fs";

import { Comment, Post } from "../models/post.model";

import dbErrorHandler from "../utils/dbErrorHandler";

const create = (req: Request, res: Response, next: NextFunction) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Image could not be uploaded",
      });
    }
    let post = new Post(fields);
    post.postedBy = res.locals.profile;
    if (files.photo) {
      post.photo.data = fs.readFileSync(files.photo.path);
      post.photo.contentType = files.photo.type;
    }
    try {
      let result = await post.save();
      res.json(result);
    } catch (err) {
      return res.status(400).json({
        error: dbErrorHandler.getErrorMessage(err),
      });
    }
  });
};

const postByID = async (
  req: Request,
  res: Response,
  next: NextFunction,
  id: string
) => {
  try {
    let post = await Post.findById(id).populate("postedBy", "_id name").exec();
    if (!post)
      return res.status(400).json({
        error: "Post not found",
      });
    res.locals.post = post;
    next();
  } catch (err) {
    return res.status(400).json({
      error: "Could not retrieve use post",
    });
  }
};

const listByUser = async (req: Request, res: Response) => {
  try {
    let posts = await Post.find({ postedBy: res.locals.profile._id })
      .populate("comments.postedBy", "_id name")
      .populate("postedBy", "_id name")
      .sort("-created")
      .exec();
    res.json(posts);
  } catch (err) {
    return res.status(400).json({
      error: dbErrorHandler.getErrorMessage(err),
    });
  }
};

const listNewsFeed = async (req: Request, res: Response) => {
  let following = res.locals.profile.following;
  following.push(res.locals.profile._id);
  try {
    let posts = await Post.find({
      postedBy: { $in: res.locals.profile.following },
    })
      .populate("comments.postedBy", "_id name")
      .populate("postedBy", "_id name")
      .sort("-created")
      .exec();
    res.json(posts);
  } catch (err) {
    return res.status(400).json({
      error: dbErrorHandler.getErrorMessage(err),
    });
  }
};

const remove = async (req: Request, res: Response) => {
  let post = res.locals.post;
  try {
    let deletedPost = await post.remove();
    res.json(deletedPost);
  } catch (err) {
    return res.status(400).json({
      error: dbErrorHandler.getErrorMessage(err),
    });
  }
};

const photo = (req: Request, res: Response, next: NextFunction) => {
  res.set("Content-Type", res.locals.post.photo.contentType);
  return res.send(res.locals.post.photo.data);
};

const like = async (req: Request, res: Response) => {
  try {
    let result = await Post.findByIdAndUpdate(
      req.body.postId,
      { $push: { likes: req.body.userId } },
      { new: true }
    );
    res.json(result);
  } catch (err) {
    return res.status(400).json({
      error: dbErrorHandler.getErrorMessage(err),
    });
  }
};

const unlike = async (req: Request, res: Response) => {
  try {
    let result = await Post.findByIdAndUpdate(
      req.body.postId,
      { $pull: { likes: req.body.userId } },
      { new: true }
    );
    res.json(result);
  } catch (err) {
    return res.status(400).json({
      error: dbErrorHandler.getErrorMessage(err),
    });
  }
};

const comment = async (req: Request, res: Response) => {
  try {
    let comment = await Comment.create(req.body.comment);
    comment.postedBy = req.body.userId;

    let result = await Post.findByIdAndUpdate(
      req.body.postId,
      { $push: { comments: comment } },
      { new: true }
    )
      .populate("comments.postedBy", "_id name")
      .populate("postedBy", "_id name")
      .exec();
    res.json(result);
  } catch (err) {
    return res.status(400).json({
      error: dbErrorHandler.getErrorMessage(err),
    });
  }
};

const uncomment = async (req: Request, res: Response) => {
  let comment = req.body.comment;
  try {
    let result = await Post.findByIdAndUpdate(
      req.body.postId,
      { $pull: { comments: { _id: comment._id } } },
      { new: true }
    )
      .populate("comments.postedBy", "_id name")
      .populate("postedBy", "_id name")
      .exec();
    res.json(result);
  } catch (err) {
    return res.status(400).json({
      error: dbErrorHandler.getErrorMessage(err),
    });
  }
};

const isPoster = (req: Request, res: Response, next: NextFunction) => {
  let isPoster =
    res.locals.post &&
    res.locals.auth &&
    res.locals.post.postedBy._id == res.locals.auth.id;
  if (!isPoster) {
    return res.status(403).json({
      error: "User is not authorized",
    });
  }
  next();
};

export default {
  listByUser,
  listNewsFeed,
  create,
  postByID,
  remove,
  photo,
  like,
  unlike,
  comment,
  uncomment,
  isPoster,
};

import { NextFunction, Request, Response } from "express";
import formidable from "formidable";
import fs from "fs";
import { extend } from "lodash";

import { User } from "../models/user.model";

import { CreateUserInput } from "../schema/user.schema";

import dbErrorHandler from "../utils/dbErrorHandler";

const create = async (
  req: Request<{}, {}, CreateUserInput["body"]>,
  res: Response,
  next: NextFunction
) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user)
      return res.status(400).json({
        message: "User already registered.",
      });

    await User.create({ name, email, password });
    return res.status(200).json({
      message: "Successfully signed up!",
    });
  } catch (err) {
    return res.status(400).json({
      error: dbErrorHandler.getErrorMessage(err),
    });
  }
};

const list = async (req: Request, res: Response) => {
  try {
    let users = await User.find().select("name email updatedAt createdAt");
    res.json(users);
  } catch (err) {
    return res.status(400).json({
      error: dbErrorHandler.getErrorMessage(err),
    });
  }
};

const read = async (req: Request, res: Response) => {
  try {
    let user = await User.findById(req.params.id).select(
      "name email updatedAt createdAt"
    );

    if (!user)
      return res.status(400).json({
        error: "User not found",
      });

    return res.json(user);
  } catch (err) {
    return res.status(400).json({
      error: "Could not retrieve user",
    });
  }
};

const update = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.params.id;
  let user = await User.findById(userId);

  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Photo could not be uploaded",
      });
    }

    user = extend(user, fields);

    if (files.photo) {
      user.photo.data = fs.readFileSync(files.photo.path);
      user.photo.contentType = files.photo.type;
    }
    try {
      await user.save();
      user.password = undefined;
      res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  });
};

const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User has been deleted.");
  } catch (err) {
    next(err);
  }
};

export default { create, read, list, remove, update };

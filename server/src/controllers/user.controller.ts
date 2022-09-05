import { NextFunction, Request, Response } from "express";

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
  const update = req.body;
  if (req.params.id === res.locals.auth.id) {
    try {
      const updatedUser = await User.findOneAndUpdate({ _id: userId }, update, {
        new: true,
      });
      res.status(200).json(updatedUser);
    } catch (err) {
      next(err);
    }
  } else {
    return res.status(403).json({
      error: "You can update only your account!",
    });
  }
};

const remove = async (req: Request, res: Response, next: NextFunction) => {
  if (req.params.id === res.locals.auth.id) {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("User has been deleted.");
    } catch (err) {
      next(err);
    }
  } else {
    return res.status(403).json("You can delete only your account!");
  }
};

export default { create, read, list, remove, update };

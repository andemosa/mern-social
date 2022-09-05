import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import { User } from "../models/user.model";

import { SigninInput } from "../schema/user.schema";

dotenv.config();

const jwtSecret = process.env.JWT_SECRET;
const EXPIRES_IN = process.env.EXPIRES_IN;

const signin = async (
  req: Request<{}, {}, SigninInput["body"]>,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findOne({ email: req.body.email }).select(
      "+password"
    );
    if (!user)
      return res.status(401).json({
        error: "User not found",
      });

    const passMatch = await user.comparePassword(req.body.password);

    if (!passMatch) {
      return res.status(401).send({
        error: "Email and password don't match.",
      });
    }

    const token = jwt.sign({ id: user._id }, jwtSecret!, {
      expiresIn: EXPIRES_IN,
    });

    res
      .cookie("access_token", token, {
        httpOnly: true,
        expires: new Date(new Date().getTime() + 60 * 60000),
      })
      .status(200)
      .json({
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
        },
      });
  } catch (err) {
    next(err);
  }
};

const signout = (req: Request, res: Response) => {
  res.clearCookie("access_token");
  return res.status(200).json({
    message: "signed out",
  });
};

export default { signin };

import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { get } from "lodash";

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token =
    get(req, "cookies.access_token") ||
    get(req, "headers.authorization", "").replace(/^Bearer\s/, "");

  if (!token)
    return res.status(401).json({
      message: "You are not authenticated!",
    });

  try {
    let decoded = jwt.verify(token, process.env.JWT_SECRET!);

    if (decoded) {
      res.locals.auth = decoded;
      return next();
    }
  } catch (error) {
    next(error);
  }
};

export const isOwner = (req: Request, res: Response, next: NextFunction) => {
  if (req.params.id === res.locals.auth.id) {
    next();
  } else {
    return res.status(403).json({
      error: "You can update only your account!",
    });
  }
};

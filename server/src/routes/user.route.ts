import express from "express";

import userController from "../controllers/user.controller";

import validate from "../middleware/validateResource";

import { createUserSchema } from "../schema/user.schema";
import { isOwner, verifyToken } from "../utils/verifyToken";

const router = express.Router();

router
  .route("/api/users")
  .get(userController.list)
  .post(validate(createUserSchema), userController.create);

router
  .route("/api/users/:id")
  .get(userController.read)
  .put(verifyToken, isOwner, userController.update)
  .delete(verifyToken, isOwner, userController.remove);

export default router;

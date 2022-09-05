import express from "express";

import userController from "../controllers/user.controller";

import validate from "../middleware/validateResource";

import { createUserSchema } from "../schema/user.schema";
import { verifyToken } from "../utils/verifyToken";

const router = express.Router();

router
  .route("/api/users")
  .get(userController.list)
  .post(validate(createUserSchema), userController.create);

router
  .route("/api/users/:id")
  .get(userController.read)
  .put(verifyToken, userController.update)
  .delete(verifyToken, userController.remove);

export default router;

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

router.route("/api/users/photo/:id").get(userController.photo);

router
  .route("/api/users/follow")
  .put(verifyToken, userController.addFollowing, userController.addFollower);
  
router
  .route("/api/users/unfollow")
  .put(
    verifyToken,
    userController.removeFollowing,
    userController.removeFollower
  );

router
  .route("/api/users/findpeople/:userId")
  .get(verifyToken, userController.findPeople);

router
  .route("/api/users/:id")
  .get(userController.read)
  .put(verifyToken, isOwner, userController.update)
  .delete(verifyToken, isOwner, userController.remove);

export default router;

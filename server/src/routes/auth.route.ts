import express from "express";

import authCtrl from "../controllers/auth.controller";

import validate from "../middleware/validateResource";

import { signinSchema } from "../schema/user.schema";

const router = express.Router();

router.route("/auth/signin").post(validate(signinSchema), authCtrl.signin);

// router.route('/auth/signout')
//   .get(authCtrl.signout)

export default router;

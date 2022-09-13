import express from 'express'

import userCtrl from '../controllers/user.controller'
import postCtrl from '../controllers/post.controller'

import { isOwner, verifyToken } from "../utils/verifyToken";

const router = express.Router()

router.route('/api/posts/new/:userId')
  .post(verifyToken, postCtrl.create)

router.route('/api/posts/photo/:postId')
  .get(postCtrl.photo)

router.route('/api/posts/by/:userId')
  .get(verifyToken, postCtrl.listByUser)

router.route('/api/posts/feed/:userId')
  .get(verifyToken, postCtrl.listNewsFeed)

router.route('/api/posts/like')
  .put(verifyToken, postCtrl.like)
router.route('/api/posts/unlike')
  .put(verifyToken, postCtrl.unlike)

router.route('/api/posts/comment')
  .put(verifyToken, postCtrl.comment)
router.route('/api/posts/uncomment')
  .put(verifyToken, postCtrl.uncomment)

router.route('/api/posts/:postId')
  .delete(verifyToken, postCtrl.isPoster, postCtrl.remove)

router.param('userId', userCtrl.userByID)
router.param('postId', postCtrl.postByID)

export default router

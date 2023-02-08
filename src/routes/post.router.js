const postRouter = require('express').Router();
const postController = require('../controllers/post.controller');
const { checkAuth } = require('../utils/checkAuth');
const { upload } = require('../utils/s3');

postRouter.post(
  '',
  checkAuth,
  upload.array('image', 5),
  postController.createPost
);
postRouter.get('', checkAuth, postController.getPost);
postRouter.get('/users/:userId', checkAuth, postController.getPostByUserId);

module.exports = { postRouter };

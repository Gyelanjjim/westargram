const postRouter = require('express').Router();
const postController = require('../controllers/post.controller');
const { checkAuth } = require('../utils/checkAuth');

postRouter.post('', checkAuth, postController.createPost);
postRouter.get('', checkAuth, postController.getPost);
postRouter.get('/users/:userId', checkAuth, postController.getPostByUserId);

module.exports = { postRouter };

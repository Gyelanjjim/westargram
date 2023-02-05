const postRouter = require('express').Router();
const postController = require('../controllers/post.controller');
const { checkAuth } = require('../utils/checkAuth');

postRouter.post('', checkAuth, postController.createPost);

module.exports = { postRouter };

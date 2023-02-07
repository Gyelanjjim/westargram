const commentRouter = require('express').Router();
const commentController = require('../controllers/comment.controller');
const { checkAuth } = require('../utils/checkAuth');

commentRouter.post('', checkAuth, commentController.createComment);
commentRouter.get('', checkAuth, commentController.getMyComment);
commentRouter.delete('/:commentId', checkAuth, commentController.deleteComment);

module.exports = { commentRouter };

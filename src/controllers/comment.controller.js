const commentService = require('../services/comment.service');
const { catchAsync } = require('../utils/error');

const createComment = catchAsync(async (req, res, next) => {
  const { postId, content } = req.body;
  const userId = req.user.id;

  if (!postId) {
    const err = new Error('KEY_ERROR');
    err.statusCode = 400;
    throw err;
  }

  await commentService.createComment(userId, postId, content);

  res.status(201).json({ message: 'commentCreated' });
});

const getMyComment = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const data = await commentService.getMyComment(userId);
  res.status(200).json(data);
});

const deleteComment = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const { commentId } = req.params;
  await commentService.deleteComment(userId, commentId);

  res.status(204).end();
});

module.exports = { createComment, getMyComment, deleteComment };

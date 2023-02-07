const commentDao = require('../models/comment.dao');

const createComment = async (userId, postId, content) => {
  await commentDao.createComment(userId, postId, content);
};

const getMyComment = async (userId) => {
  return await commentDao.getMyComment(userId);
};

const deleteComment = async (userId, commentId) => {
  const data = await commentDao.isCommentMine(userId, commentId);

  if (!data) {
    const err = new Error(`Forbidden`);
    err.statusCode = 403;
    throw err;
  }

  await commentDao.deleteComment(commentId);
};

module.exports = { createComment, getMyComment, deleteComment };

const likeService = require('../services/like.service');
const { catchAsync } = require('../utils/error');

const createOrDeleteLike = catchAsync(async (req, res, next) => {
  const { postId } = req.body;
  const userId = req.user.id;

  if (!postId) {
    const err = new Error('KEY_ERROR');
    err.statusCode = 400;
    throw err;
  }

  const data = await likeService.createOrDeleteLike(userId, postId);

  if (data) {
    res.status(201).json({ message: 'likeCreated' });
  } else {
    res.status(204).end();
  }
});

const getLikeList = catchAsync(async (req, res, next) => {
  const userId = req.user.id;

  const data = await likeService.getLikeList(userId);

  res.status(200).json(data);
});

module.exports = { createOrDeleteLike, getLikeList };

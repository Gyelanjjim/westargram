const postService = require('../services/post.service');
const { catchAsync } = require('../utils/error');

const createPost = catchAsync(async (req, res, next) => {
  const { title, content, image } = req.body;
  const userId = req.user.id;

  if (!title || !content || !image) {
    const err = new Error('KEY_ERROR');
    err.statusCode = 400;
    throw err;
  }

  await postService.createPost(userId, title, content, image);

  res.status(201).json({ message: 'postCreated' });
});

const getPost = catchAsync(async (req, res, next) => {
  const data = await postService.getPost();

  res.status(200).json(data);
});

const getPostByUserId = catchAsync(async (req, res, next) => {
  const myId = req.user.id;
  const { userId } = req.params;
  const data = await postService.getPostByUserId(myId, userId);
  res.status(200).json(data);
});

module.exports = { createPost, getPost, getPostByUserId };

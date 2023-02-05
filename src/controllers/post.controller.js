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

module.exports = { createPost };

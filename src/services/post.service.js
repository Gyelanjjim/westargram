const postDao = require('../models/post.dao');

const createPost = async (userId, title, content, image) => {
  await postDao.createPost(userId, title, content, image);
};

module.exports = { createPost };

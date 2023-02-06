const postDao = require('../models/post.dao');

const createPost = async (userId, title, content, image) => {
  await postDao.createPost(userId, title, content, image);
};

const getPost = async () => {
  const data = await postDao.getPost();
  return data;
};

const getPostByUserId = async (myId, userId) => {
  const data = await postDao.getPostByUserId(userId);
  myId === +userId ? (data['isMine'] = true) : (data['isMine'] = false);

  return data;
};

module.exports = { createPost, getPost, getPostByUserId };

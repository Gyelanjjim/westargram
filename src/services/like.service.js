const likeDao = require('../models/like.dao');

const createOrDeleteLike = async (userId, postId) => {
  const data = await likeDao.isExistLike(userId, postId);

  if (data.isExist === '1') {
    await likeDao.deleteLike(userId, postId);

    return 0;
  } else {
    await likeDao.createLike(userId, postId);

    return 1;
  }
};

const getLikeList = async (userId) => {
  const data = await likeDao.getLikeList(userId);
  return data;
};

module.exports = { createOrDeleteLike, getLikeList };

const likeRouter = require('express').Router();
const likeController = require('../controllers/like.controller');
const { checkAuth } = require('../utils/checkAuth');

likeRouter.post('', checkAuth, likeController.createOrDeleteLike);
likeRouter.get('/my', checkAuth, likeController.getLikeList);

module.exports = { likeRouter };

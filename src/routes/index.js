const routes = require('express').Router();

const { userRouter } = require('./user.router');
const { postRouter } = require('./post.router');
const { likeRouter } = require('./like.router');

routes.use('/users', userRouter);
routes.use('/posts', postRouter);
routes.use('/likes', likeRouter);

module.exports = { routes };

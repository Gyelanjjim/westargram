const routes = require('express').Router();

const { userRouter } = require('./user.router');
const { postRouter } = require('./post.router');

routes.use('/users', userRouter);
routes.use('/posts', postRouter);

module.exports = { routes };

const userRouter = require('express').Router();
const userController = require('../controllers/user.controller');

userRouter.post('/signup', userController.signUp);
userRouter.post('/signin', userController.signIn);

module.exports = { userRouter };

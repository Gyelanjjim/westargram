const userRouter = require('express').Router();
const userController = require('../controllers/user.controller');
const { checkAuth } = require('../utils/checkAuth');

userRouter.post('/signup', userController.signUp);
userRouter.post('/signin', userController.signIn);
userRouter.get('/:userId', checkAuth, userController.getUserByUserId);
userRouter.put('', checkAuth, userController.updateUser);

module.exports = { userRouter };

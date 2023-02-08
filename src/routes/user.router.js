const userRouter = require('express').Router();
const userController = require('../controllers/user.controller');
const { checkAuth } = require('../utils/checkAuth');
const { upload } = require('../utils/s3');

userRouter.post('/signup', upload.single('image'), userController.signUp);
userRouter.post('/signin', userController.signIn);
userRouter.get('/:userId', checkAuth, userController.getUserByUserId);
userRouter.put(
  '',
  checkAuth,
  upload.single('image'),
  userController.updateUser
);

module.exports = { userRouter };

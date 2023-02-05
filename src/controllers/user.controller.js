const userService = require('../services/user.service');
const { catchAsync } = require('../utils/error');

const signUp = catchAsync(async (req, res, next) => {
  const { name, email, profileImage, password, username } = req.body;

  if (!name || !email || !password || !username) {
    const err = new Error('KEY_ERROR');
    err.statusCode = 400;
    throw err;
  }

  await userService.signUp(name, email, profileImage, password, username);

  res.status(201).json({ message: 'userCreated' });
});

const signIn = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    const err = new Error('KEY_ERROR');
    err.statusCode = 400;
    throw err;
  }

  const accessToken = await userService.signIn(email, password);

  res.status(200).json({ accessToken: accessToken });
});

const getUserByUserId = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  const myId = req.user.id;

  const data = await userService.getUserByUserId(userId, myId);

  res.status(200).json(data);
});

const updateUser = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const keys = req.body;

  if (keys.email) {
    const err = new Error(`Forbidden`);
    err.statusCode = 403;
    throw err;
  }

  await userService.updateUser(userId, keys);

  res.status(200).json({ message: 'userUpdated' });
});

module.exports = { signUp, signIn, getUserByUserId, updateUser };

const userService = require('../services/user.service');
const { catchAsync } = require('../utils/error');

const signUp = catchAsync(async (req, res, next) => {
  const { name, email, profileImage, password } = req.body;

  if (!name || !email || !password) {
    const err = new Error('KEY_ERROR');
    err.statusCode = 400;
    throw err;
  }

  await userService.signUp(name, email, profileImage, password);

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

module.exports = { signUp, signIn };

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userDao = require('../models/user.dao');
const { validateEmail, validatePw } = require('../utils/validators');

const signUp = async (name, email, profileImage, password) => {
  validateEmail(email);
  validatePw(password);

  const user = await userDao.getUserByEmail(email);

  if (user) {
    const err = new Error(`duplicated eamil`);
    err.statusCode = 400;
    throw err;
  }

  const hashedPassword = await bcrypt.hash(password, 8);

  await userDao.signUp(name, email, profileImage, hashedPassword);
};

const signIn = async (email, password) => {
  validatePw(password);

  const user = await userDao.getUserByEmail(email);

  if (!user) {
    const err = new Error('specified user does not exist');
    err.statusCode = 404;
    throw err;
  }

  const result = await bcrypt.compare(password, user.password);

  if (!result) {
    const err = new Error('invalid password');
    err.statusCode = 401;
    throw err;
  }

  return jwt.sign({ sub: user.id }, process.env.JWT_SECRET);
};

module.exports = { signUp, signIn };

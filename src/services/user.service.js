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

module.exports = { signUp };

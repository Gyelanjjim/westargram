const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userDao = require('../models/user.dao');
const {
  validateEmail,
  validatePw,
  validateUsername,
} = require('../utils/validators');

const signUp = async (name, email, profileImage, password, username) => {
  validateEmail(email);
  validatePw(password);
  validateUsername(username);

  const user = await userDao.getUserByEmail(email);

  if (user) {
    const err = new Error(`duplicated eamil`);
    err.statusCode = 400;
    throw err;
  }

  const user2 = await userDao.getUserByUsername(username);

  if (user2) {
    const err = new Error(`duplicated username`);
    err.statusCode = 400;
    throw err;
  }

  const hashedPassword = await bcrypt.hash(password, 8);

  await userDao.signUp(name, email, profileImage, hashedPassword, username);
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

const getUserByUserId = async (userId, myId) => {
  const data = await userDao.getUserByUserId(userId);
  delete data.password;
  delete data.updated_at;

  if (+userId === myId) {
    data['isMine'] = true;
  } else {
    data['isMine'] = false;
    delete data.email;
  }

  return data;
};

const updateUser = async (userId, keys) => {
  if (keys.username) {
    validateUsername(keys.username);

    const user = await userDao.getUserByUsername(keys.username);
    if (user) {
      const err = new Error(`duplicated username`);
      err.statusCode = 400;
      throw err;
    }
  }

  if (keys.password) {
    validatePw(keys.password);

    const hashedPassword = await bcrypt.hash(keys.password, 8);
    keys.password = hashedPassword;
  }

  const setClause = (keys) => {
    const arr = [];
    for (let [key, value] of Object.entries(keys)) {
      arr.push('u.' + key + ' = "' + value + '"');
    }
    return 'SET ' + arr.join(',');
  };

  await userDao.updateUser(userId, setClause(keys));
};

module.exports = { signUp, signIn, getUserByUserId, updateUser };

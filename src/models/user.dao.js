const { appDataSource } = require('./dataSource');

const signUp = async (name, email, profileImage, hashedPassword) => {
  await appDataSource.query(
    `
    INSERT INTO users(
        name, 
        email,
        profile_image,
        password
    ) VALUES (?, ?, ?, ?);
    `,
    [name, email, profileImage, hashedPassword]
  );
};

const getUserByUserId = async (userId) => {
  const [user] = await appDataSource.query(
    `
    SELECT *
      FROM users u
      WHERE u.id = ?; 
    `,
    [userId]
  );
  return user;
};

const getUserByEmail = async (email) => {
  const [user] = await appDataSource.query(
    `
    SELECT *
      FROM users u
      WHERE u.email = ?; 
    `,
    [email]
  );
  return user;
};

module.exports = { signUp, getUserByUserId, getUserByEmail };

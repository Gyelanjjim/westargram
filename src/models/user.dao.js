const { appDataSource } = require('./dataSource');

const signUp = async (name, email, profileImage, hashedPassword, username) => {
  await appDataSource.query(
    `
    INSERT INTO users(
        name, 
        email,
        profile_image,
        password,
        username
    ) VALUES (?, ?, ?, ?, ?);
    `,
    [name, email, profileImage, hashedPassword, username]
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

const getUserByUsername = async (username) => {
  const [user] = await appDataSource.query(
    `
      SELECT *
        FROM users u
        WHERE u.username = ?; 
      `,
    [username]
  );
  return user;
};

const updateUser = async (userId, setClause) => {
  await appDataSource.query(
    `
    UPDATE users u
    ${setClause}
    WHERE u.id = ?;
    `,
    [userId]
  );
};

module.exports = {
  signUp,
  getUserByUserId,
  getUserByEmail,
  getUserByUsername,
  updateUser,
};

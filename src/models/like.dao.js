const { appDataSource } = require('./dataSource');

const isExistLike = async (userId, postId) => {
  const [isExist] = await appDataSource.query(
    `SELECT EXISTS(
        SELECT *
            FROM likes
            WHERE user_id = ? and post_id = ? 
    ) AS isExist;
    `,
    [userId, postId]
  );
  return isExist;
};

const createLike = async (userId, postId) => {
  await appDataSource.query(
    `INSERT INTO likes(
        user_id, 
        post_id
    ) VALUES ( ?, ? );
    `,
    [userId, postId]
  );
};

const deleteLike = async (userId, postId) => {
  await appDataSource.query(
    `DELETE 
    FROM likes
    WHERE user_id = ? and post_id = ?; 
    `,
    [userId, postId]
  );
};

const getLikeList = async (userId) => {
  return await appDataSource.query(
    `SELECT 
        p.id AS postId,
        u.username AS authorName,
        p.title,
        l.created_at
    FROM likes l
    INNER JOIN posts p ON p.id = l.post_id
    INNER JOIN users u ON u.id = p.user_id
    WHERE l.user_id = ?
    ORDER BY l.created_at DESC;
    `,
    [userId]
  );
};

module.exports = { isExistLike, createLike, deleteLike, getLikeList };

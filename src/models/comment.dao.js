const { appDataSource } = require('./dataSource');

const isCommentMine = async (userId, commentId) => {
  const [isExist] = await appDataSource.query(
    `SELECT EXISTS(
        SELECT *
            FROM comments
            WHERE user_id = ? and id = ? 
    ) AS isExist;
    `,
    [userId, commentId]
  );
  return isExist;
};

const createComment = async (userId, postId, content) => {
  await appDataSource.query(
    `INSERT INTO comments(
        user_id, 
        post_id,
        content
    ) VALUES ( ?, ?, ? );
    `,
    [userId, postId, content]
  );
};

const getMyComment = async (userId) => {
  const [data] = await appDataSource.query(
    `SELECT 
        c.user_id AS commenterId,
        JSON_ARRAYAGG(
            JSON_OBJECT(
                "commentId", c.id,
                "postId", c.post_id,
                "postTitle", p.title,
                "commentCreatedTime", c.created_at,
                "commentUpdatedTime", c.updated_at,
                "content", c.content
            )
        ) AS comment
        FROM comments c
        INNER JOIN posts p ON p.id = c.post_id
        WHERE c.user_id = ? 
        GROUP BY c.user_id;
    `,
    [userId]
  );
  return data;
};

const deleteComment = async (commentId) => {
  await appDataSource.query(
    `DELETE 
    FROM comments
    WHERE id = ?; 
    `,
    [commentId]
  );
};

module.exports = {
  isCommentMine,
  createComment,
  getMyComment,
  deleteComment,
};

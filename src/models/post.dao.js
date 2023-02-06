const { appDataSource } = require('./dataSource');

const createPost = async (userId, title, content, image) => {
  const queryRunner = appDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const post = await appDataSource.query(
      `
      INSERT INTO posts(
          user_id,
          title, 
          content
      ) VALUES (?, ?, ?);
      `,
      [userId, title, content]
    );

    const imageBulk = image.map((image) => `(${post.insertId}, "${image}")`);
    const values = imageBulk.join(', ');

    await appDataSource.query(
      `
    INSERT INTO post_images(
        post_id,
        image
    ) VALUES ${values};
    `
    );

    await queryRunner.commitTransaction();
  } catch (err) {
    await queryRunner.rollbackTransaction();
  } finally {
    await queryRunner.release();
  }
};

const getPost = async () => {
  return await appDataSource.query(
    `
    select distinct
    p.id AS postId,
    p.title,
    pi.images,
    p.content,
    p.created_at,
    p.updated_at,
    u.id AS authorId,
    u.username AS authorNick,
    (select
        COUNT(l.id)
        FROM likes l
        WHERE l.post_id = p.id
    ) likeCount,
    lu.liker,
    cm.comment
    FROM posts p
    LEFT JOIN (
        SELECT 
          post_id,
          JSON_ARRAYAGG(
            image
          ) as images
        FROM post_images
        GROUP BY post_id
    ) pi ON p.id = pi.post_id
    LEFT JOIN (
        SELECT 
          post_id,
          JSON_ARRAYAGG(
            JSON_OBJECT(
                "id", user_id,
                "username", users.username
            )
          ) as liker
        FROM likes
        INNER JOIN users ON users.id = user_id
        GROUP BY post_id
    ) lu ON p.id = lu.post_id
    LEFT JOIN (
        SELECT 
          post_id,
          JSON_ARRAYAGG(
            JSON_OBJECT(
                "id", comments.id,
                "userId", comments.user_id,
                "username", users.username,
                "content", content
            )
          ) as comment
        FROM comments
        INNER JOIN users ON users.id = user_id
        GROUP BY post_id
    ) cm ON p.id = cm.post_id
    INNER JOIN users u ON u.id = p.user_id
    LEFT JOIN likes l ON p.id = l.post_id;
    `
  );
};

const getPostByUserId = async (userId) => {
  return await appDataSource.query(
    `select distinct
    u.id AS authorId,
    u.username AS authorNick,
    "id", p.id,
    "title", p.title,
    "images", pi.images,
    "content", p.content,
    "created_at", p.created_at,
    "updated_at", p.updated_at,
    (select
        COUNT(l.id)
        FROM likes l
        WHERE l.post_id = p.id) as likeCount,
    "liker", lu.liker,
    "comment", cm.comment
    FROM posts p
    LEFT JOIN (
        SELECT 
          post_id,
          JSON_ARRAYAGG(
            image
          ) as images
        FROM post_images
        GROUP BY post_id
    ) pi ON p.id = pi.post_id
    LEFT JOIN (
        SELECT 
          post_id,
          JSON_ARRAYAGG(
            JSON_OBJECT(
                "id", user_id,
                "username", users.username
            )
          ) as liker
        FROM likes
        INNER JOIN users ON users.id = user_id
        GROUP BY post_id
    ) lu ON p.id = lu.post_id
    LEFT JOIN (
        SELECT 
          post_id,
          JSON_ARRAYAGG(
            JSON_OBJECT(
                "id", comments.id,
                "userId", comments.user_id,
                "username", users.username,
                "content", content
            )
          ) as comment
        FROM comments
        INNER JOIN users ON users.id = user_id
        GROUP BY post_id
    ) cm ON p.id = cm.post_id
    INNER JOIN users u ON u.id = p.user_id
    LEFT JOIN likes l ON p.id = l.post_id
    WHERE p.user_id = ?;
    `,
    [userId]
  );
};

module.exports = {
  createPost,
  getPost,
  getPostByUserId,
};

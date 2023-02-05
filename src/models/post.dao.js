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

module.exports = {
  createPost,
};

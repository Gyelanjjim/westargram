-- migrate:up
ALTER TABLE posts DROP COLUMN image;
ALTER TABLE users MODIFY email VARCHAR(100);
ALTER TABLE users MODIFY password VARCHAR(100);

-- migrate:down
DROP TABLE posts;
DROP TABLE users;

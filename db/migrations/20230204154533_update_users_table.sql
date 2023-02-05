-- migrate:up
ALTER TABLE users ADD username VARCHAR(50) NOT NULL;

-- migrate:down
DROP TABLE users;

-- migrate:up
ALTER TABLE comments ADD content VARCHAR(3000) NOT NULL;


-- migrate:down
DROP TABLE comments;
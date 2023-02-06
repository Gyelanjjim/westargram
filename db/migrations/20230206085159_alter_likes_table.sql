-- migrate:up
ALTER TABLE likes ADD created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- migrate:down
DROP TABLE likes;
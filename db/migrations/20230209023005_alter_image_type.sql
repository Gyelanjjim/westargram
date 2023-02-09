-- migrate:up
ALTER TABLE users MODIFY profile_image VARCHAR(2083);
ALTER TABLE post_images MODIFY image VARCHAR(2083);

-- migrate:down

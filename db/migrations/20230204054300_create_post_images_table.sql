-- migrate:up
CREATE TABLE post_images
(
  id INT NOT NULL AUTO_INCREMENT,
  post_id INT NOT NULL,
  image VARCHAR(2000) NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (post_id) REFERENCES posts (id) 
);

-- migrate:down
DROP TABLE post_images;

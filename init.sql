
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
);

CREATE TABLE tweets (
    id SERIAL PRIMARY KEY,
    creator_id INT REFERENCES users(id) NOT NULL,
    content VARCHAR(280) NOT NULL,
    dateCreated TIMESTAMP NOT NULL DEFAULT NOW()
   
);

INSERT INTO users (username, password)
VALUES  ('hello', 'sdlkfnlkf');

INSERT INTO tweets (content, creator_id) 
VALUES ('ajdffadkf', 1);


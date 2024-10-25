CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    client_offset TEXT UNIQUE,
    content TEXT
);

CREATE TABLE images (
    id SERIAL PRIMARY KEY,
    image_name VARCHAR(255) NOT NULL,
    image_data BYTEA NOT NULL
);

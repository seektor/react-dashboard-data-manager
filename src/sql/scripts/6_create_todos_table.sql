DROP TABLE IF EXISTS todos;

CREATE TABLE todos
(
    id SERIAL PRIMARY KEY NOT NULL,
    user_id INTEGER REFERENCES users (id) NOT NULL,
    title VARCHAR(50) NOT NULL,
    description VARCHAR(500) NOT NULL
)
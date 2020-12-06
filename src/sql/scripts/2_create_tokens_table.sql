DROP TABLE IF EXISTS tokens;

CREATE TABLE tokens(
    id SERIAL PRIMARY KEY NOT NULL,
    access_token VARCHAR(500) NOT NULL,
    user_id SERIAL NOT NULL REFERENCES users (id)
);
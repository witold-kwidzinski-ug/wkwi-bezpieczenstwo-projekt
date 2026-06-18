CREATE DATABASE app_db;
CREATE DATABASE keycloak_db;

CREATE USER keycloak WITH PASSWORD 'keycloak';

GRANT ALL PRIVILEGES ON DATABASE keycloak_db TO keycloak;

\connect keycloak_db

ALTER SCHEMA public OWNER TO keycloak;
GRANT ALL ON SCHEMA public TO keycloak;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO keycloak;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO keycloak;



\connect app_db


CREATE TABLE games (id SERIAL PRIMARY KEY, name TEXT NOT NULL);

CREATE TABLE favourites (userid TEXT NOT NULL, gameid INT NOT NULL, PRIMARY KEY (userid, gameid), FOREIGN KEY (gameid) REFERENCES games(id) ON DELETE CASCADE);

INSERT INTO games (name) VALUES ("gra");
INSERT INTO games (name) VALUES ("kolejna gra");
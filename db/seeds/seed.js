const db = require('../connection');
const format = require('pg-format');
const { formatUsers } = require('../../utils/utils');

const seed = (data) => {
  const { articleData, commentData, topicData, userData } = data;

  return db
    .query(`DROP TABLE IF EXISTS comments;`)
    .then(() => db.query(`DROP TABLE IF EXISTS articles;`))
    .then(() => db.query(`DROP TABLE IF EXISTS topics;`))
    .then(() => db.query(`DROP TABLE IF EXISTS users;`))
    .then(() => {
      return db.query(`CREATE TABLE users (
            username VARCHAR PRIMARY KEY,
            avatar_url VARCHAR,
            name VARCHAR
          );`);
    })
    .then(() => {
      return db.query(`CREATE TABLE topics (
        slug VARCHAR PRIMARY KEY,
        description VARCHAR
      );`);
    })
    .then(() => {
      return db.query(`CREATE TABLE articles (
        article_id SERIAL PRIMARY KEY,
        title VARCHAR NOT NULL,
        body VARCHAR NOT NULL,
        votes INT DEFAULT 0,
        topic VARCHAR REFERENCES topics(slug) NOT NULL,
        author VARCHAR REFERENCES users(username) NOT NULL,
        created_at DATE DEFAULT NOW() NOT NULL
      );`);
    })
    .then(() => {
      return db.query(`CREATE TABLE comments (
        comment_id SERIAL PRIMARY KEY,
        author VARCHAR REFERENCES users(username) NOT NULL,
        article_id INT REFERENCES articles(article_id),
        votes INT DEFAULT 0,
        created_at DATE DEFAULT NOW() NOT NULL,
        body TEXT NOT NULL
      );`);
    })
    .then(() => {
      return db.query(
        format(
          `INSERT INTO users (username, name, avatar_url ) VALUES %L`,
          formatUsers(userData)
        )
      );
    });
};

module.exports = seed;

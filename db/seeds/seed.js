const db = require('../connection');
const format = require('pg-format');
const {
  formatUsers,
  formatTopics,
  formatArticles,
  formatComments,
} = require('../../utils');

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
        created_at TIMESTAMP DEFAULT NOW()
      );`);
    })
    .then(() => {
      return db.query(`CREATE TABLE comments (
        comment_id SERIAL PRIMARY KEY,
        author VARCHAR REFERENCES users(username) NOT NULL,
        article_id INT REFERENCES articles(article_id) ON DELETE CASCADE,
        votes INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
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
    })
    .then(() => {
      return db.query(
        format(
          `INSERT INTO topics (slug, description) VALUES %L`,
          formatTopics(topicData)
        )
      );
    })
    .then(() => {
      return db.query(
        format(
          `INSERT INTO articles (title, body, votes, topic, author, created_at) VALUES %L`,
          formatArticles(articleData)
        )
      );
    })
    .then(() => {
      return db.query(
        format(
          `INSERT INTO comments (author, article_id, votes, created_at, body) VALUES %L`,
          formatComments(commentData)
        )
      );
    });
};

module.exports = seed;

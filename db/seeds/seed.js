const db = require('../connection');
const format = require('pg-format');
const {
  formatUsers,
  formatTopics,
  formatArticles,
  formatComments,
} = require('../../utils');

const seed = async (data) => {
  const { articleData, commentData, topicData, userData } = data;

  await db.query(`DROP TABLE IF EXISTS comments;`);
  await db.query(`DROP TABLE IF EXISTS articles;`);
  await db.query(`DROP TABLE IF EXISTS topics;`);
  await db.query(`DROP TABLE IF EXISTS users;`);

  await db.query(`CREATE TABLE users (
    username VARCHAR PRIMARY KEY,
    avatar_url VARCHAR,
    name VARCHAR
  );`);

  await db.query(`CREATE TABLE topics (
    slug VARCHAR PRIMARY KEY,
    description VARCHAR
  );`);

  await db.query(`CREATE TABLE articles (
    article_id SERIAL PRIMARY KEY,
    title VARCHAR NOT NULL,
    body VARCHAR NOT NULL,
    votes INT DEFAULT 0,
    topic VARCHAR REFERENCES topics(slug) NOT NULL,
    author VARCHAR REFERENCES users(username) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
  );`);

  await db.query(`CREATE TABLE comments (
    comment_id SERIAL PRIMARY KEY,
    author VARCHAR REFERENCES users(username) NOT NULL,
    article_id INT REFERENCES articles(article_id) ON DELETE CASCADE,
    votes INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    body TEXT NOT NULL
  );`);

  await db.query(
    format(
      `INSERT INTO users (username, name, avatar_url ) VALUES %L`,
      formatUsers(userData)
    )
  );

  await db.query(
    format(
      `INSERT INTO topics (slug, description) VALUES %L`,
      formatTopics(topicData)
    )
  );

  await db.query(
    format(
      `INSERT INTO articles (title, body, votes, topic, author, created_at) VALUES %L`,
      formatArticles(articleData)
    )
  );

  await db.query(
    format(
      `INSERT INTO comments (author, article_id, votes, created_at, body) VALUES %L`,
      formatComments(commentData)
    )
  );
};

module.exports = seed;

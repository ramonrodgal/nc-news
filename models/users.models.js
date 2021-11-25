const db = require('../db/connection');

exports.fetchUsers = async () => {
  const queryString = `SELECT username FROM users`;

  const { rows: users } = await db.query(queryString);

  return users;
};

exports.fetchUserByUsername = async (username) => {
  const queryString = `SELECT username, avatar_url, name FROM users WHERE username = $1`;

  const queryParams = [username];

  const { rows } = await db.query(queryString, queryParams);

  if (rows.length === 0) {
    return Promise.reject({ status: 404, msg: 'User Not Found' });
  }

  return rows[0];
};

exports.fetchArticlesByUsername = async (username) => {
  const queryString = `SELECT * FROM articles WHERE author = $1`;
  const queryParams = [username];

  const { rows } = await db.query(queryString, queryParams);

  console.log(rows);

  if (rows.length === 0) {
    return Promise.reject({ status: 404, msg: 'Articles Not Found' });
  }

  return rows;
};

const db = require('../db/connection');

exports.fetchUsers = async () => {
  const queryString = `SELECT username FROM users`;

  const { rows: users } = await db.query(queryString);

  return users;
};

exports.fetchUserByUsername = async (username) => {
  const queryString = `SELECT username, avatar_url, name FROM users WHERE username = $1`;

  const queryParams = [username];

  const { rows: user } = await db.query(queryString, queryParams);

  return user[0];
};

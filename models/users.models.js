const db = require('../db/connection');

exports.fetchUsers = async () => {
  const queryString = `SELECT username FROM users`;

  const { rows: users } = await db.query(queryString);

  console.log(users);

  return users;
};

const db = require('../db/connection.js');

exports.fetchTopics = async () => {
  const { rows: topics } = await db.query(`SELECT * from topics;`);
  return topics;
};

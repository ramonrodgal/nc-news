const db = require('../db/connection.js');

exports.fetchTopics = async () => {
  const { rows: topics } = await db.query(`SELECT * from topics;`);
  return topics;
};

exports.insertTopic = async (body) => {
  const { slug, description } = body;

  if (
    !slug ||
    !description ||
    typeof slug !== 'string' ||
    typeof slug !== 'string'
  ) {
    return Promise.reject({ status: 400, msg: 'Bad request. Invalid body' });
  }

  const queryString = `
    INSERT INTO topics
      (slug, description)
    VALUES
      ($1, $2)
    RETURNING *`;
  const queryParams = [slug, description];

  const { rows } = await db.query(queryString, queryParams);

  return rows[0];
};

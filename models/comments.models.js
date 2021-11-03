const db = require('../db/connection.js');

exports.removeCommentById = async (comment_id) => {
  const queryString = `DELETE FROM comments WHERE comment_id = $1 RETURNING *`;
  const queryParams = [comment_id];

  const { rows } = await db.query(queryString, queryParams);

  if (rows.length === 0) {
    return Promise.reject({ status: 404, msg: 'Comment Not Found' });
  }

  return;
};

exports.updateCommentById = async (comment_id, inc_votes) => {
  const queryString = `
    UPDATE comments
    SET votes = votes + $1
    WHERE comment_id = $2
    RETURNING *`;

  const queryParams = [inc_votes, comment_id];

  const { rows } = await db.query(queryString, queryParams);

  return rows[0];
};

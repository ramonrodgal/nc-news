const db = require('../db/connection.js');

exports.removeCommentById = async (comment_id) => {
  const queryString = `DELETE FROM comments WHERE comment_id = $1`;
  const queryParams = [comment_id];

  return await db.query(queryString, queryParams);
};

const db = require('../db/connection.js');
const { formatArticlesResponse } = require('../utils/models');

exports.fetchArticleById = async (article_id) => {
  const queryStr = `
      SELECT 
        articles.*, COUNT(comments.comment_id) AS comment_count
      FROM articles
      JOIN comments 
      ON articles.article_id = comments.article_id
      WHERE articles.article_id = $1
      GROUP BY articles.article_id;`;

  const queryParams = [article_id];

  const { rows } = await db.query(queryStr, queryParams);

  return formatArticlesResponse(rows);
};

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

  if (rows.length === 0) {
    return Promise.reject({ status: 404, msg: 'Article Not Found' });
  }

  return formatArticlesResponse(rows);
};

exports.updateArticleById = async (article_id, body) => {
  const { inc_votes } = body;

  let queryString = `
    UPDATE articles 
    SET votes = votes + $1 
    WHERE article_id = $2`;

  let queryParams = [inc_votes, article_id];

  await db.query(queryString, queryParams);

  return await this.fetchArticleById(article_id);
};

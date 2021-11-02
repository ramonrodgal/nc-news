const db = require('../db/connection.js');
const {
  formatArticleResponse,
  formatCommentResponse,
} = require('../utils/models');

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

  return formatArticleResponse(rows[0]);
};

exports.updateArticleById = async (article_id, body) => {
  const { inc_votes } = body;

  if (!inc_votes) {
    return Promise.reject({ status: 400, msg: 'Bad Request. Invalid body' });
  }

  let queryString = `
    UPDATE articles 
    SET votes = votes + $1 
    WHERE article_id = $2
    RETURNING *`;

  let queryParams = [inc_votes, article_id];

  const response = await db.query(queryString, queryParams);

  if (response.rows.length === 0) {
    return Promise.reject({ status: 404, msg: 'Article Not Found' });
  }

  return await this.fetchArticleById(article_id);
};

exports.fetchArticles = async () => {
  const queryString = `
      SELECT 
        articles.*, COUNT(comments.comment_id) AS comment_count
      FROM articles
      LEFT JOIN comments 
      ON articles.article_id = comments.article_id
      GROUP BY articles.article_id;`;

  const { rows } = await db.query(queryString);

  const articles = rows.map((article) => formatArticleResponse(article));

  return articles;
};

exports.fetchCommentsFromArticle = async (article_id) => {
  const queryString = `
    SELECT comment_id, votes, created_at, author, body
    FROM comments
    WHERE article_id = $1`;

  const queryParams = [article_id];

  const { rows } = await db.query(queryString, queryParams);

  if (rows.length === 0) {
    return Promise.reject({ status: 404, msg: 'Article Not Found' });
  }

  const comments = rows.map((comment) => formatCommentResponse(comment));

  return comments;
};

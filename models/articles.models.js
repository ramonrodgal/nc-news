const db = require('../db/connection.js');
const { formatCommentResponse } = require('../utils');

exports.fetchArticleById = async (article_id) => {
  const queryStr = `
      SELECT 
        articles.*, CAST(COUNT(comments.comment_id) AS INTEGER) AS comment_count
      FROM articles
      LEFT JOIN comments 
      ON articles.article_id = comments.article_id
      WHERE articles.article_id = $1
      GROUP BY articles.article_id;`;

  const queryParams = [article_id];

  const { rows } = await db.query(queryStr, queryParams);

  if (rows.length === 0) {
    return Promise.reject({ status: 404, msg: 'Article Not Found' });
  }

  return rows[0];
};

exports.updateArticleById = async (article_id, body) => {
  const { inc_votes } = body;

  if (Object.keys(body).length === 0) {
    const article = await this.fetchArticleById(article_id);
    return Promise.reject({ status: 400, article: article });
  }

  if (!inc_votes || typeof inc_votes !== 'number') {
    return Promise.reject({ status: 400, msg: 'Bad Request. Invalid Body' });
  }

  let queryString = `
    UPDATE articles 
    SET votes = votes + $1 
    WHERE article_id = $2
    RETURNING *`;

  let queryParams = [inc_votes, article_id];

  const { rows } = await db.query(queryString, queryParams);

  if (rows.length === 0) {
    return Promise.reject({ status: 404, msg: 'Article Not Found' });
  }

  return await this.fetchArticleById(article_id);
};

exports.fetchArticles = async (
  sort_by = 'created_at',
  order = 'desc',
  topic
) => {
  if (
    ![
      'article_id',
      'title',
      'votes',
      'body',
      'topic',
      'author',
      'created_at',
      'comment_count',
    ].includes(sort_by)
  ) {
    return Promise.reject({ status: 400, msg: 'Invalid sort_by query' });
  }

  if (!['asc', 'desc'].includes(order)) {
    return Promise.reject({ status: 400, msg: 'Invalid order query' });
  }

  let queryString = `
      SELECT 
        articles.*, CAST(COUNT(comments.comment_id)AS INTEGER) AS comment_count
      FROM articles
      LEFT JOIN comments 
      ON articles.article_id = comments.article_id`;

  if (topic) {
    queryString += ` WHERE articles.topic = '${topic}'`;
  }

  queryString += ` GROUP BY articles.article_id ORDER BY ${sort_by} ${order}`;

  const { rows } = await db.query(queryString);

  if (rows.length === 0) {
    if (topic) {
      const { rows } = await db.query('SELECT * FROM topics WHERE slug = $1', [
        topic,
      ]);
      if (rows.length > 0) {
        return [];
      }
    }
    return Promise.reject({ status: 404, msg: 'Articles Not Found' });
  }

  return rows;
};

exports.insertArticle = async (requestBody) => {
  const { author, title, body, topic } = requestBody;

  let queryString = `
    INSERT INTO articles 
      (title, topic, author, body)
    VALUES
      ($1, $2, $3, $4)
    RETURNING article_id`;

  let queryParams = [title, topic, author, body];

  const { rows } = await db.query(queryString, queryParams);
  const article_id = rows[0].article_id;
};

exports.fetchCommentsFromArticle = async (article_id) => {
  const queryString = `
    SELECT comment_id, votes, created_at, author, body
    FROM comments
    WHERE article_id = $1`;

  const queryParams = [article_id];

  const { rows } = await db.query(queryString, queryParams);

  if (rows.length === 0) {
    const article = await this.fetchArticleById(article_id);
    if (article) {
      return [];
    }
    return Promise.reject({ status: 404, msg: 'Article Not Found' });
  }

  return rows;
};

exports.insertCommentByArticleId = async (article_id, requestBody) => {
  const { username, body } = requestBody;

  const requiredFields = ['username', 'body'];
  let allFields = true;
  let allFieldTypes = true;
  const fieldTypesReference = {
    username: 'string',
    body: 'string',
  };

  for (let requiredField of requiredFields) {
    if (!requestBody.hasOwnProperty(requiredField)) {
      allFields = false;
    }
    if (
      fieldTypesReference[requiredField] !== typeof requestBody[requiredField]
    ) {
      allFieldTypes = false;
    }
  }

  if (!allFields || !allFieldTypes) {
    return Promise.reject({ status: 400, msg: 'Bad Request. Invalid Body' });
  }

  const queryString = `INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *;`;
  const queryParams = [username, body, article_id];

  const { rows: user } = await db.query(
    'SELECT * FROM users WHERE username = $1',
    [username]
  );

  if (user.length === 0) {
    return Promise.reject({
      status: 404,
      msg: 'Username does not exist',
    });
  }

  const { rows } = await db.query(queryString, queryParams);

  return formatCommentResponse(rows[0]);
};

exports.removeArticleById = async (article_id) => {
  const queryString = `
    DELETE FROM articles
    WHERE article_id = $1
    RETURNING *`;

  const queryParams = [article_id];

  const { rows } = await db.query(queryString, queryParams);

  if (rows.length === 0) {
    return Promise.reject({ status: 404, msg: 'Article Not Found' });
  }
  return;
};

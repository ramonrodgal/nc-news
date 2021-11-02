const articlesRouters = require('express').Router();
const {
  getArticleById,
  patchArticleById,
  getArticles,
  getCommentsFromArticle,
  postCommentByArticleId,
} = require('../controllers/articles.controllers');

articlesRouters
  .route('/:article_id/comments')
  .get(getCommentsFromArticle)
  .post(postCommentByArticleId);

articlesRouters
  .route('/:article_id')
  .get(getArticleById)
  .patch(patchArticleById);

articlesRouters.route('/').get(getArticles);

module.exports = articlesRouters;

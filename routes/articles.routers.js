const articlesRouters = require('express').Router();
const {
  getArticleById,
  patchArticleById,
  deleteArticleById,
  getArticles,
  postArticle,
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
  .patch(patchArticleById)
  .delete(deleteArticleById);

articlesRouters.route('/').get(getArticles).post(postArticle);

module.exports = articlesRouters;

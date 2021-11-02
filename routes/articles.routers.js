const articlesRouters = require('express').Router();
const {
  getArticleById,
  patchArticleById,
  getArticles,
} = require('../controllers/articles.controllers');

articlesRouters
  .route('/:article_id')
  .get(getArticleById)
  .patch(patchArticleById);

articlesRouters.route('/').get(getArticles);

module.exports = articlesRouters;

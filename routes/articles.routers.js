const articlesRouters = require('express').Router();
const {
  getArticleById,
  patchArticleById,
} = require('../controllers/articles.controllers');

articlesRouters
  .route('/:article_id')
  .get(getArticleById)
  .patch(patchArticleById);

module.exports = articlesRouters;

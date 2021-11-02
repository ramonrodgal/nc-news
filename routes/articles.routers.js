const articlesRouters = require('express').Router();
const { getArticleById } = require('../controllers/articles.controllers');

articlesRouters.route('/:article_id').get(getArticleById);

module.exports = articlesRouters;

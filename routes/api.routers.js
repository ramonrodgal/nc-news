const apiRouter = require('express').Router();
const topicsRouters = require('./topics.routers');
const articlesRouters = require('./articles.routers');

apiRouter.use('/topics', topicsRouters);

apiRouter.use('/articles', articlesRouters);

module.exports = apiRouter;

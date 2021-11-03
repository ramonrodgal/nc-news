const apiRouter = require('express').Router();
const topicsRouters = require('./topics.routers');
const articlesRouters = require('./articles.routers');
const commentsRouters = require('./comments.routers');

apiRouter.use('/topics', topicsRouters);

apiRouter.use('/articles', articlesRouters);

apiRouter.use('/comments', commentsRouters);

module.exports = apiRouter;

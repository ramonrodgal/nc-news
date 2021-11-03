const apiRouter = require('express').Router();

const topicsRouters = require('./topics.routers');
const articlesRouters = require('./articles.routers');
const commentsRouters = require('./comments.routers');
const usersRouters = require('./users.routers');

apiRouter.use('/topics', topicsRouters);

apiRouter.use('/articles', articlesRouters);

apiRouter.use('/comments', commentsRouters);

apiRouter.use('/users', usersRouters);

module.exports = apiRouter;

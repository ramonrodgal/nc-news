const apiRouter = require('express').Router();

const topicsRouters = require('./topics.routers');
const articlesRouters = require('./articles.routers');
const commentsRouters = require('./comments.routers');
const usersRouters = require('./users.routers');

const { getEndpoints } = require('../controllers/api.controllers');

apiRouter.use('/topics', topicsRouters);

apiRouter.use('/articles', articlesRouters);

apiRouter.use('/comments', commentsRouters);

apiRouter.use('/users', usersRouters);

apiRouter.route('/').get(getEndpoints);

module.exports = apiRouter;

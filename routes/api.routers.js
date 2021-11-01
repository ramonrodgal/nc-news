const apiRouter = require('express').Router();

apiRouter.use('/topics', topicsRouters);

module.exports = apiRouter;

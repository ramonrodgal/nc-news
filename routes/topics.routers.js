const { getTopics } = require('../controllers/topics.controllers');
const topicsRouters = require('express').Router();

topicsRouters.route('/').get(getTopics);

module.exports = topicsRouters;

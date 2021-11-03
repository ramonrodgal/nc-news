const { getTopics, postTopic } = require('../controllers/topics.controllers');
const topicsRouters = require('express').Router();

topicsRouters.route('/').get(getTopics).post(postTopic);

module.exports = topicsRouters;

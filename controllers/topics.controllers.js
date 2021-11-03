const { fetchTopics, insertTopic } = require('../models/topics.models');

exports.getTopics = async (req, res, next) => {
  try {
    const topics = await fetchTopics();
    res.status(200).send({ topics });
  } catch (err) {
    next(err);
  }
};

exports.postTopic = async (req, res, next) => {
  const { body } = req;

  try {
    const topic = await insertTopic(body);
    res.status(201).send({ topic });
  } catch (err) {
    next(err);
  }
};

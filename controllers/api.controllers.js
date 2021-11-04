const { fetchEndpoints } = require('../models/api.models');

exports.getEndpoints = async (req, res, next) => {
  try {
    const endpoints = await fetchEndpoints();
    res.status(200).send(endpoints);
  } catch (err) {
    next(err);
  }
};

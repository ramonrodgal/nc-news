const {
  fetchUsers,
  fetchUserByUsername,
  fetchArticlesByUsername,
} = require('../models/users.models');

exports.getUsers = async (req, res, next) => {
  try {
    const users = await fetchUsers();
    res.status(200).send({ users });
  } catch (err) {
    next(err);
  }
};

exports.getUserByUsername = async (req, res, next) => {
  const { username } = req.params;

  try {
    const user = await fetchUserByUsername(username);
    res.status(200).send({ user });
  } catch (err) {
    next(err);
  }
};

exports.getArticlesByUsername = async (req, res, next) => {
  const { username } = req.params;
  try {
    const articles = await fetchArticlesByUsername(username);
    res.status(200).send({ articles });
  } catch (err) {
    next(err);
  }
};

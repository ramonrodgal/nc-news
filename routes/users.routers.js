const usersRouters = require('express').Router();
const {
  getUsers,
  getUserByUsername,
  getArticlesByUsername,
} = require('../controllers/users.controllers');

usersRouters.route('/').get(getUsers);
usersRouters.route('/:username').get(getUserByUsername);
usersRouters.route('/:username/articles').get(getArticlesByUsername);

module.exports = usersRouters;

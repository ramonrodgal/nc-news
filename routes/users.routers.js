const usersRouters = require('express').Router();
const {
  getUsers,
  getUserByUsername,
} = require('../controllers/users.controllers');

usersRouters.route('/').get(getUsers);
usersRouters.route('/:username').get(getUserByUsername);

module.exports = usersRouters;

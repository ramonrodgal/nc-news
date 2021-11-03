const usersRouters = require('express').Router();
const { getUsers } = require('../controllers/users.controllers');

usersRouters.route('/').get(getUsers);

module.exports = usersRouters;

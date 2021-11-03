const commentsRouters = require('express').Router();
const { deleteCommentById } = require('../controllers/comments.controllers');

commentsRouters.route('/:comment_id').delete(deleteCommentById);

module.exports = commentsRouters;

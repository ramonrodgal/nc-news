const commentsRouters = require('express').Router();
const {
  deleteCommentById,
  patchCommentById,
} = require('../controllers/comments.controllers');

commentsRouters
  .route('/:comment_id')
  .delete(deleteCommentById)
  .patch(patchCommentById);

module.exports = commentsRouters;

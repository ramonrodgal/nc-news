const { removeCommentById } = require('../models/comments.models');

exports.deleteCommentById = async (req, res, next) => {
  const { comment_id } = req.params;

  try {
    await removeCommentById(comment_id);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};

const {
  removeCommentById,
  updateCommentById,
} = require('../models/comments.models');

exports.deleteCommentById = async (req, res, next) => {
  const { comment_id } = req.params;

  try {
    await removeCommentById(comment_id);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};

exports.patchCommentById = async (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;

  const comment = await updateCommentById(comment_id, inc_votes);
  res.status(200).send({ comment });
};

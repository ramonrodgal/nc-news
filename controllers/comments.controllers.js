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
  const { body } = req;

  try {
    const comment = await updateCommentById(comment_id, body);
    res.status(200).send({ comment });
  } catch (err) {
    next(err);
  }
};

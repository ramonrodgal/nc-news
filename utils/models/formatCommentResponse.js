const { formatDate } = require('../index');

exports.formatCommentResponse = (comment) => {
  return {
    comment_id: comment.comment_id,
    votes: comment.votes,
    created_at: formatDate(comment.created_at),
    author: comment.author,
    body: comment.body,
  };
};

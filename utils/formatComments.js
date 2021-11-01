const { formatDate } = require('./formatDate');

exports.formatComments = (comments) => {
  if (!comments || comments.length === 0) return [];

  return comments.map((comment) => {
    return [
      comment.author,
      comment.article_id,
      comment.votes,
      formatDate(comment.created_at),
      comment.body,
    ];
  });
};

const { formatDate } = require('../formatDate');

exports.formatArticleResponse = (article) => {
  return {
    author: article.author,
    title: article.title,
    article_id: article.article_id,
    body: article.body,
    topic: article.topic,
    created_at: formatDate(article.created_at),
    votes: article.votes,
    comment_count: parseInt(article.comment_count),
  };
};

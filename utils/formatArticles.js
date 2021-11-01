const { formatDate } = require('./formatDate');

exports.formatArticles = (articles) => {
  if (!articles || articles.length === 0) return [];

  return articles.map((article) => {
    return [
      article.title,
      article.body,
      article.votes,
      article.topic,
      article.author,
      formatDate(article.created_at),
    ];
  });
};

const { formatDate } = require('../formatDate');

exports.formatArticlesResponse = (articles) => {
  if (articles.length === 1) {
    return {
      author: articles[0].author,
      title: articles[0].title,
      article_id: articles[0].article_id,
      body: articles[0].body,
      topic: articles[0].topic,
      created_at: formatDate(articles[0].created_at),
      votes: articles[0].votes,
      comment_count: parseInt(articles[0].comment_count),
    };
  } else {
    return [];
  }
};

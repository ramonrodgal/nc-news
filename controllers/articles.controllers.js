const { fetchArticleById } = require('../models/articles.models');

exports.getArticleById = async (req, res, next) => {
  const { article_id } = req.params;
  const article = await fetchArticleById(article_id);

  res.status(200).send({ article });
};

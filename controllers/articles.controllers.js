const {
  fetchArticleById,
  updateArticleById,
  fetchArticles,
  fetchCommentsFromArticle,
  insertCommentByArticleId,
} = require('../models/articles.models');

exports.getArticleById = async (req, res, next) => {
  const { article_id } = req.params;

  try {
    const article = await fetchArticleById(article_id);
    res.status(200).send({ article });
  } catch (err) {
    next(err);
  }
};

exports.patchArticleById = async (req, res, next) => {
  const { article_id } = req.params;
  const { body } = req;

  try {
    const article = await updateArticleById(article_id, body);
    res.status(200).send({ article });
  } catch (err) {
    next(err);
  }
};

exports.getArticles = async (req, res, next) => {
  const { sort_by } = req.query;

  try {
    const articles = await fetchArticles(sort_by);
    res.status(200).send({ articles });
  } catch (err) {
    next(err);
  }
};

exports.getCommentsFromArticle = async (req, res, next) => {
  const { article_id } = req.params;
  try {
    const comments = await fetchCommentsFromArticle(article_id);
    res.status(200).send({ comments });
  } catch (err) {
    next(err);
  }
};

exports.postCommentByArticleId = async (req, res, next) => {
  const { article_id } = req.params;
  const { body: requestBody } = req;

  try {
    const comment = await insertCommentByArticleId(article_id, requestBody);

    res.status(200).send({ comment });
  } catch (err) {
    next(err);
  }
};

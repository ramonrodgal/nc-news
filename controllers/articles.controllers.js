const {
  fetchArticleById,
  updateArticleById,
  fetchArticles,
  insertArticle,
  fetchCommentsFromArticle,
  insertCommentByArticleId,
  removeArticleById,
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
  const { sort_by, order, topic, limit, page } = req.query;

  try {
    const articles = await fetchArticles(sort_by, order, topic, limit, page);
    res.status(200).send(articles);
  } catch (err) {
    next(err);
  }
};

exports.postArticle = async (req, res, next) => {
  const { body: requestBody } = req;

  try {
    const comment = await insertArticle(requestBody);
    res.status(201).send({ comment });
  } catch (err) {
    next(err);
  }
};

exports.getCommentsFromArticle = async (req, res, next) => {
  const { article_id } = req.params;
  const { limit, p } = req.query;

  try {
    const comments = await fetchCommentsFromArticle(article_id, limit, p);
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

    res.status(201).send({ comment });
  } catch (err) {
    next(err);
  }
};

exports.deleteArticleById = async (req, res, next) => {
  const { article_id } = req.params;

  try {
    await removeArticleById(article_id);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) {
    if (err.article) {
      res.status(err.status).send({ article: err.article });
    }
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.handlePsqlErrors = (err, req, res, next) => {
  if (err.code) {
    const psqlErrorReferences = {
      '22P02': {
        status: 400,
        msg: 'Bad Request',
      },
      23503: {
        status: 404,
        msg: 'Not Found',
      },
    };

    const error = psqlErrorReferences[err.code];

    res.status(error.status).send({ msg: error.msg });
  } else {
    next(err);
  }
};
exports.handle500Errors = (err, req, res, next) => {
  res.status(500).send({ msg: 'Internal Server Error' });
};

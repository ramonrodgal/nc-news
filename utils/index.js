const { formatUsers } = require('./formatUsers');
const { formatTopics } = require('./formatTopics');
const { formatDate } = require('./formatDate');
const { formatArticles } = require('./formatArticles');
const { formatComments } = require('./formatComments');
const { formatCommentResponse } = require('./formatCommentResponse');
const { isNumber } = require('./isNumber');

module.exports = {
  formatUsers,
  formatTopics,
  formatDate,
  formatArticles,
  formatComments,
  formatCommentResponse,
  isNumber,
};

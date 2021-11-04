const { formatUsers } = require('../utils/formatUsers');
const { formatTopics } = require('../utils/formatTopics');
const { formatDate } = require('../utils/formatDate');
const { formatArticles } = require('../utils/formatArticles');
const { formatComments } = require('./formatComments');
const { formatCommentResponse } = require('./formatCommentResponse');

module.exports = {
  formatUsers,
  formatTopics,
  formatDate,
  formatArticles,
  formatComments,
  formatCommentResponse,
};

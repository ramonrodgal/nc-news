exports.formatUsers = (users) => {
  if (!users) return [];

  return users.map((user) => [user.username, user.name, user.avatar_url]);
};

exports.formatTopics = (topics) => {
  if (!topics) return [];

  return topics.map((topic) => [topic.slug, topic.description]);
};

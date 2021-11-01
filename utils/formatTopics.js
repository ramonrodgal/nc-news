exports.formatTopics = (topics) => {
  if (!topics || topics.length === 0) return [];

  return topics.map((topic) => [topic.slug, topic.description]);
};

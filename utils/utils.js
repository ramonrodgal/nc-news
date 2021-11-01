exports.formatUsers = (users) => {
  if (!users) return [];

  return users.map((user) => [user.username, user.name, user.avatar_url]);
};

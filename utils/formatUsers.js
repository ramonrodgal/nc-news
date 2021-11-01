exports.formatUsers = (users) => {
  if (!users || users.length === 0) return [];

  return users.map((user) => [user.username, user.name, user.avatar_url]);
};

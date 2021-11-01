exports.formatDate = (date) => {
  return date.toISOString().split('T').join(' ').slice(0, -5);
};

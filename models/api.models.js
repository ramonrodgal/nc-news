const { readFile } = require('fs/promises');

exports.fetchEndpoints = async () => {
  const endpoints = await readFile('endpoints.json', 'utf-8');
  return JSON.parse(endpoints);
};

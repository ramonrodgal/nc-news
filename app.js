const express = require('express');
const apiRouter = require('./routes/api.routers');

const app = express();
app.use(express.json());

app.use('/api', apiRouter);

app.all('*', (req, res) => {
  res.status(404).send({ msg: 'Invalid URL' });
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: 'Internal Server Error' });
});

module.exports = app;

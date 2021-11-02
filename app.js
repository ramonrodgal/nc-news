const express = require('express');
const apiRouter = require('./routes/api.routers');
const {
  handleCustomErrors,
  handlePsqlErrors,
  handle500Errors,
} = require('./controllers/errors.controllers');

const app = express();
app.use(express.json());

app.use('/api', apiRouter);

app.all('*', (req, res) => {
  res.status(404).send({ msg: 'Invalid URL' });
});

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handle500Errors);

module.exports = app;

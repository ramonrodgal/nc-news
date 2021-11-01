const express = require(express);
const apiRouter = require('./routes/api.routers');

const app = express();
app.use(express.json());

app.use('/api', apiRouter);

module.exports = app;

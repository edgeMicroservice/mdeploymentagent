const init = require('@bananabread/init');
const app = require('connect')();

let config = require('./configuration/config');

init(app, __dirname, config).then((result) => {
  ({ config } = result);
});

module.exports = app;

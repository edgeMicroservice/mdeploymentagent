const app = require('connect')();

const init = require('@mimik/init');
const cluster = require('@mimik/cluster');

let config = require('./configuration/config');

init(app, __dirname, config, [], cluster(config))
  .then((result) => {
    ({ config } = result);
  });

module.exports = app;

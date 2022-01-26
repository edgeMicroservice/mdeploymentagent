const Promise = require('bluebird');

const { filterConfig, healthInfo, getHealthCheckInfo } = require('@mimik/systeminfo');

const config = require('../configuration/config');

const dataFunctions = {
  config: (response) => {
    if (!response.data.system) response.data.system = {};
    response.data.system.config = filterConfig(config);
    return Promise.resolve(null);
  },
  healthCheck: (response) => {
    if (!response.data.system) response.data.system = {};
    response.data.system.healthCheck = healthInfo();
    return Promise.resolve(null);
  },
};

const getHealthCheck = (req, res) => getHealthCheckInfo(req, res);

const getInfo = (types, correlationId) => {
  const response = { data: {} };
  return Promise.map(types, (type) => {
    try {
      return dataFunctions[type](response, correlationId)
        .catch((err) => {
          response.data[type] = { error: err.message };
          return response.data[type];
        });
    }
    catch (err) {
      return null;
    }
  }).then(() => response);
};

module.exports = {
  getInfo,
  getHealthCheck,
};

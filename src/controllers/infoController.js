const { sendResult, sendError, getRichError } = require('@mimik/response-helper');
const { convertParams } = require('@mimik/swagger-helper');

const processor = require('../processors/infoProcessor');

const getInfo = (req, res) => {
  const options = convertParams(req);
  const { types, correlationId } = options;

  if (!types || types.length === 0) {
    sendError(getRichError('Parameter', 'types must have at least 1 item'), res, null, options);
    return;
  }

  processor.getInfo(types, correlationId)
    .then((result) => sendResult(result, 200, res, options))
    .catch((err) => sendError(err, res, null, options));
};

const getHealthCheck = (req, res) => processor.getHealthCheck(req, res);

module.exports = {
  getInfo,
  getHealthCheck,
};

const { sendResult, sendError } = require('@mimik/response-helper');
const { convertParams } = require('@mimik/swagger-helper');

const fileProcessor = require('../processors/fileProcessor');

const createFile = (req, res) => {
  const options = convertParams(req);
  const { file, correlationId } = options;

  fileProcessor.deployFile(file, correlationId)
    .then((results) => sendResult(results, 201, res, options))
    .catch((err) => sendError(err, res, null, options));
};

module.exports = {
  createFile,
};

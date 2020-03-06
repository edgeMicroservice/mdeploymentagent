const { sendResult, sendError } = require('@bananabread/response-helper');
const { convertParams } = require('@bananabread/swagger-helper');

const imageProcessor = require('../processors/imageProcessor');

const createImage = (req, res) => {
  const options = convertParams(req);

  imageProcessor.deployImage(options.image, options.correlationId)
    .then((results) => sendResult(results, 201, res, options))
    .catch((err) => sendError(err, res, null, options));
};

module.exports = {
  createImage,
};

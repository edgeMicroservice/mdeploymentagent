const rp = require('request-promise');
const fs = require('fs-extra');
const uuid = require('uuid');

const logger = require('@bananabread/sumologic-winston-logger');
const { getRichError } = require('@bananabread/response-helper');

const deployImage = (imageDetails, correlationId) => {
  const { imageLink, deploymentLink, service } = imageDetails;
  const fileName = `${uuid.v4()}.tar`;
  const filePath = `./${fileName}`;

  const removeImageFile = () => fs.remove(filePath)
    .catch((err) => {
      logger.error('cannot remove image from file directory', { err, filePath }, correlationId);
    });

  return rp({
    uri: imageLink.url,
    method: imageLink.method,
  })
    .then((result) => fs.outputFile(filePath, result)
      .then(() => {
        const options = {
          uri: deploymentLink.url,
          headers: {
            ...deploymentLink.headers,
          },
          method: deploymentLink.method,
          formData: {
            image: {
              value: fs.createReadStream(filePath),
              options: {
                filename: fileName,
              },
            },
          },
        };
        return options;
      }))
    .catch((err) => {
      throw getRichError('System', 'cannot fetch image from the imageLink', { imageLink, service }, err, false, correlationId);
    })
    .then(rp)
    .then(JSON.parse)
    .catch((err) => {
      throw getRichError('System', 'cannot deploy image to deploymentLink', { deploymentLink, service }, err, false, correlationId);
    })
    .finally(removeImageFile);
};

module.exports = {
  deployImage,
};

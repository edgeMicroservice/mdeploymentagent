const rp = require('request-promise');
const fs = require('fs-extra');

const { getRichError } = require('@bananabread/response-helper');

const deployImage = (imageDetails, correlationId) => {
  const { imageLink, deploymentLink, service } = imageDetails;
  return rp({
    uri: imageLink.url,
    method: imageLink.method,
  })
    .then((result) => {
      const filePath = `./${service.name}-${service.version}.tar`;
      return fs.outputFile(filePath, result)
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
                  filename: `${service.name}-${service.version}.tar`,
                },
              },
            },
          };
          return options;
        });
    })
    .catch((err) => {
      throw getRichError('System', 'cannot fetch image from the imageLink', { imageLink, service }, err, false, correlationId);
    })
    .then(rp)
    .then(JSON.parse)
    .catch((err) => {
      throw getRichError('System', 'cannot deploy image to deploymentLink', { deploymentLink, service }, err, false, correlationId);
    });
};

module.exports = {
  deployImage,
};

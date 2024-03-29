const axios = require('axios');
const fs = require('fs-extra');
const uuid = require('uuid');
const { findKey } = require('lodash');
const FormData = require('form-data');

const logger = require('@mimik/sumologic-winston-logger');
const { getRichError } = require('@mimik/response-helper');

const { maxFileSize } = require('../configuration/config');

const STREAM = '$file.stream';
const BASE64 = '$file.base64';

const downloadFile = (requestOptions, fileOutputPath) => {
  const writer = fs.createWriteStream(fileOutputPath);

  return axios({
    ...requestOptions,
    responseType: 'stream',
    maxBodyLength: maxFileSize,
    maxContentLength: maxFileSize,
  })
    .then((response) => new Promise((resolve, reject) => {
      response.data.pipe(writer);
      let error = null;
      writer.on('error', (err) => {
        error = err;
        writer.close();
        reject(err);
      });
      writer.on('close', () => {
        if (!error) {
          resolve(true);
        }
      });
    }));
};

const deployFile = (fileDetails, correlationId) => {
  const { originLink, destinationLink } = fileDetails;

  const fileName = `${uuid.v4()}`;
  const filePath = `./${fileName}`;

  const removeFile = () => fs.remove(filePath)
    .catch((err) => {
      logger.error('cannot remove file from directory', { err, filePath }, correlationId);
    });
  const { url, method, headers } = originLink;

  return downloadFile({
    url,
    method,
    headers,
  }, filePath)
    .catch((err) => {
      throw getRichError('System', 'cannot fetch file from the fileLink', { originLink }, err, false, correlationId);
    })
    .then(() => {
      const options = {
        url: destinationLink.url,
        method: destinationLink.method,
        maxBodyLength: maxFileSize,
        maxContentLength: maxFileSize,
      };
      if (destinationLink.formData) {
        const form = new FormData();
        const streamKey = findKey(destinationLink.formData, (val) => val === STREAM);
        if (streamKey) form.append(streamKey, fs.createReadStream(filePath));
        else throw getRichError('Parameter', 'streamKey not present in formData', { originLink }, err, false, correlationId);

        Object.keys(destinationLink.formData, (key) => {
          if (streamKey && key === streamKey) return undefined;
          form.append(key, destinationLink.formData[key]);
          return undefined;
        });
        options.data = form;
        options.headers = {
          ...form.getHeaders(),
          ...destinationLink.headers,
        };
      }
      else if (destinationLink.body) {
        options.data = { ...destinationLink.body };
        options.headers = {
          ...destinationLink.headers,
        };

        const base64Key = findKey(destinationLink.body, (val) => val === BASE64);
        if (base64Key) {
          options.data[base64Key] = fs.createReadStream(filePath, { encoding: 'base64' });
        }
      }
      return axios(options)
        .then((resp) => resp.data)
        .catch((err) => {
          throw getRichError('System', 'cannot deploy file to deploymentLink', { destinationLink }, err, false, correlationId);
        });
    })
    .finally(removeFile);
};

module.exports = {
  deployFile,
};

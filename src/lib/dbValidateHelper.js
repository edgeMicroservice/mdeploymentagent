const dynamosizer = require('@bananabread/dynamosizer');

const config = require('../configuration/config');

const dbValidate = () => dynamosizer(config).validate();

module.exports = {
  dbValidate,
};

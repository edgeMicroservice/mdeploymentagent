const { setConfig } = require('@bananabread/configuration');
const pack = require('../../package.json');

/**
 *
 * mdeploymentagent Configuration.
 *
 * @function config
 * @return {object} configuration - Server configuration.
 * @description The following environment variables are needed to configure mdeploymentagent:
 *
 * These values are on top of what is needed in the [configuration](https://bitbucket.org/mimiktech/configuration) library.
 *
 * The api is in [swaggerhub](https://app.swaggerhub.com/apis/mimik/mdeploymentagent)
 *
 */
module.exports = (() => {
  const configuration = setConfig(pack);

  return configuration;
})();

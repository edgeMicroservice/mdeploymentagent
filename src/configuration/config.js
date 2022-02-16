const { setConfig } = require('@mimik/configuration');
const pack = require('../../package.json');

/**
 *
 * mdeploymentagent Configuration.
 *
 * @function config
 * @return {object} configuration - Server configuration.
 * @description The following environment variables are needed to configure mdeploymentagent:
 * 
 * | Env variable name | Description | Default | Comments |
 * | ----------------- | ----------- | ------- | -------- |
 * | MAXIMUM_FILE_SIZE | Maximum file size to be allowed to deployed | 1000 | in MBs
 * 
 * These values are on top of what is needed in the [configuration](https://bitbucket.org/mimiktech/configuration) library.
 *
 * The api is in [swaggerhub](https://app.swaggerhub.com/apis/mimik/mdeploymentagent)
 *
 */
module.exports = (() => {
  const configuration = setConfig(pack, {
    custom: {
      maxFileSize: parseInt(process.env.MAXIMUM_FILE_SIZE, 10) * 1000000 || 1000000000,
    }
  });

  return configuration;
})();

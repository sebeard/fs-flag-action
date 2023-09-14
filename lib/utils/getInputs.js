const core = require('@actions/core');

const { getInputOrDefault, getRequiredInput } = require('./getInput');

exports.getInputs = () => {
  try {
    core.debug('Obtraining and validating input parameters');
    const environmentKey = getRequiredInput('flagsmithEnvKey');
    const projectId = getRequiredInput('flagsmithProjectId');
    const apiToken = getRequiredInput('flagsmithApiToken');
    const apiUrl = getInputOrDefault(
      'flagsmithApiUrl',
      /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/,
      'https://api.flagsmith.com/api/v1',
    );

    const scanPath = getInputOrDefault(
      'scanPath',
      /^(.+)\/([^/]+)$/,
      __dirname,
    );
    const fileName = getInputOrDefault('fileName', /^[^\s]+$/, 'flagValue.json');

    const namePrefix = getInputOrDefault('flagNamePrefix', /^[\w-_]*$/, '');
    const nameSuffix = getInputOrDefault('flagNameSuffix', /^[\w-_]*$/, '');

    return {
      flagsmithOpts: {
        environmentKey,
        projectId,
        apiToken,
        apiUrl,
      },
      scanOpts: {
        dirName: scanPath,
        fileName,
      },
      featureFlagOpts: {
        namePrefix,
        nameSuffix,
      },
    };
  } catch (e) {
    core.error('Failed to Collect Inputs');
    throw e;
  }
};

const core = require('@actions/core');

const { getInputs } = require('./utils/getInputs');
const FlagsmithAPI = require('./Flagsmith');
const { filteredFileList } = require('./utils/listFilteredFiles');
const { getParentDirectoryName } = require('./utils/getParentDirectoryName');
const { getFileContents } = require('./utils/getFileContents');

exports.setup = async () => {
  let inputs;
  let flagsmithApi;
  let featureFlagFiles;

  try {
    inputs = await getInputs();
  } catch (error) {
    core.error(error.message);
    throw error;
  }

  try {
    core.debug('Setting up Flagsmith API Client');
    flagsmithApi = new FlagsmithAPI(inputs.flagsmithOpts);
    core.debug('Searching for feature flag files');
    featureFlagFiles = await filteredFileList(inputs.scanOpts);
    const featureFlagPromises = [];

    featureFlagFiles
      .map((featureFlagFile) => {
        core.debug(`Transforming ${featureFlagFile} into feature flag object`);
        return {
          name: getParentDirectoryName(featureFlagFile),
          value: JSON.parse(getFileContents(featureFlagFile)),
        };
      })
      .forEach((featureFlag) => {
        core.info(
          `Found feature flag: ${featureFlag.name}. Upserting into Flagsmith`,
        );
        featureFlagPromises.push(
          flagsmithApi
            .getFeatureState(featureFlag.name)
            .then((featureStateId) => (featureStateId
              ? flagsmithApi.updateFeatureState(
                featureStateId,
                featureFlag.value,
              )
              : flagsmithApi.createFeature(
                featureFlag.name,
                featureFlag.value,
              ))),
        );
      });

    await Promise.all(featureFlagPromises);
  } catch (error) {
    core.error(error.message);
    throw error;
  }
};

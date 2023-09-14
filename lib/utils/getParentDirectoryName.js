const path = require('path');
const core = require('@actions/core');

exports.getParentDirectoryName = function getParentDirectoryName(filePath) {
  core.debug(`Obtaining parent directory name of ${filePath}`);
  return path.basename(path.dirname(filePath));
};

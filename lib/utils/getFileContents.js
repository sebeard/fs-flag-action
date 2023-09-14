const fs = require('fs');
const core = require('@actions/core');

exports.getFileContents = function getFileContents(filePath) {
  core.debug(`Reading contents of ${filePath}`);
  return fs.readFileSync(filePath, { encoding: 'utf8' });
};

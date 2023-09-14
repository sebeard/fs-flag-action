const fs = require('fs/promises');
const core = require('@actions/core');

exports.filteredFileList = async function filteredFileList({
  dirName,
  fileName,
}) {
  const files = [];
  const subDirectoryPromises = [];
  core.debug(
    `Searching in directory ${dirName} for any files named ${fileName}`,
  );
  await fs.readdir(dirName, { withFileTypes: true }).then(
    (items) => {
      items.forEach((item) => {
        if (item.isDirectory()) {
          core.debug(`Searching in subdirectory ${dirName}/${item.name}`);
          subDirectoryPromises.push(
            filteredFileList({ dirName: `${dirName}/${item.name}`, fileName }),
          );
        } else if (item.name === fileName) {
          core.debug(`Found feature flag file ${dirName}/${item.name}`);
          files.push(`${dirName}/${item.name}`);
        }
      });
    },
  );
  await Promise.all(subDirectoryPromises).then((foundFiles) => files.push(...foundFiles.flat()));
  return files;
};

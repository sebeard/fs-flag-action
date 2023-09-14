const { getParentDirectoryName } = require('./getParentDirectoryName');

describe('Verify get parent directory name function', () => {
  test('Should get parent directory name', () => {
    const parentDirectoryName = getParentDirectoryName('someDirName/childDirectory/grandChildDirectory/someFileName.json');

    expect(parentDirectoryName).toStrictEqual('grandChildDirectory');
  });
});

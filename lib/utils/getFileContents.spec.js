const fs = require('fs');
const { getFileContents } = require('./getFileContents');

describe('Verify get file contents function', () => {
  test('Should read file contents', async () => {
    jest.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify({ some: 'data' }));

    const fileContents = getFileContents('someDirName/someFileName.json');

    expect(fileContents).toStrictEqual(JSON.stringify({ some: 'data' }));
  });
});

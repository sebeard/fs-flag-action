const fs = require('fs/promises');
const { filteredFileList } = require('./listFilteredFiles');

jest.mock('fs/promises', () => ({
  readdir: jest.fn(),
}));

describe('Verify list filtered files function', () => {
  test('Should read files in directory and find no matches', async () => {
    fs.readdir.mockResolvedValue([
      { name: 'testFile', isDirectory: () => false },
    ]);

    const files = filteredFileList({ dirName: 'someDirName', fileName: 'someFileName.json' });

    expect(files).resolves.toStrictEqual([]);
  });

  test('Should read files in directory and find a match', async () => {
    fs.readdir.mockResolvedValue([
      { name: 'testFile', isDirectory: () => false },
      { name: 'someFileName.json', isDirectory: () => false },
    ]);

    const files = filteredFileList({ dirName: 'someDirName', fileName: 'someFileName.json' });

    expect(files).resolves.toStrictEqual(['someDirName/someFileName.json']);
  });

  test('Should read files in directory and traverse sub directories', async () => {
    fs.readdir
      .mockResolvedValueOnce([
        { name: 'testFile', isDirectory: () => false },
        { name: 'someFileName.json', isDirectory: () => false },
        { name: 'childDirectory', isDirectory: () => true },
        { name: 'childDirectory2', isDirectory: () => true },
      ])
      .mockResolvedValueOnce([
        { name: 'grandChildDirectory', isDirectory: () => true },
        { name: 'someFileName.json', isDirectory: () => false },
      ])
      .mockResolvedValue([
        { name: 'someFileName.json', isDirectory: () => false },
      ]);

    const files = filteredFileList({ dirName: 'someDirName', fileName: 'someFileName.json' });

    expect(files).resolves.toStrictEqual([
      'someDirName/someFileName.json',
      'someDirName/childDirectory/someFileName.json',
      'someDirName/childDirectory/grandChildDirectory/someFileName.json',
      'someDirName/childDirectory2/someFileName.json',
    ]);
  });
});

jest.mock('@actions/core');
const core = require('@actions/core');
const fs = require('fs');
const fspromsies = require('fs/promises');
const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
const { setup } = require('./setup');

describe('Verify end to end processing', () => {
  let axiosMock;

  beforeAll(() => {
    axiosMock = new MockAdapter(axios);
  });

  afterEach(() => {
    axiosMock.reset();
    jest.clearAllMocks();
  });

  test.each([
    { input: { flagsmithEnvKey: 'someEnvironmentKey', flagsmithProjectId: 'someProjectId', flagsmithApiToken: 'someApiToken' } },
    { input: { flagsmithEnvKey: 'someEnvironmentKey', flagsmithProjectId: 'someProjectId', flagsmithApiToken: 'someApiToken' }, flagsmithApiUrl: 'https://api.otherflagsmith.host/v1' },
    {
      input: {
        flagsmithEnvKey: 'someEnvironmentKey', flagsmithProjectId: 'someProjectId', flagsmithApiToken: 'someApiToken', scanPath: 'someDir/someChild',
      },
    },
    {
      input: {
        flagsmithEnvKey: 'someEnvironmentKey', flagsmithProjectId: 'someProjectId', flagsmithApiToken: 'someApiToken', fileName: 'FEATURE-BOM',
      },
    },
    {
      input: {
        flagsmithEnvKey: 'someEnvironmentKey', flagsmithProjectId: 'someProjectId', flagsmithApiToken: 'someApiToken', namePrefix: 'PREFIX-', nameSuffix: '-SUFFIX',
      },
    },
  ])('Should find no features for input: %o', async (test) => {
    jest.spyOn(fspromsies, 'readdir').mockResolvedValue([{ name: 'testFile', isDirectory: () => false }]);

    core.getInput = jest
      .fn()
      .mockReturnValueOnce(test.input.flagsmithEnvKey)
      .mockReturnValueOnce(test.input.flagsmithProjectId)
      .mockReturnValueOnce(test.input.flagsmithApiToken)
      .mockReturnValueOnce(test.input.flagsmithApiUrl)
      .mockReturnValueOnce(test.input.scanPath)
      .mockReturnValueOnce(test.input.fileName)
      .mockReturnValueOnce(test.input.namePrefix)
      .mockReturnValueOnce(test.input.nameSuffix);

    await setup();

    expect(axiosMock.history.get.length).toBe(0);
    expect(axiosMock.history.patch.length).toBe(0);
    expect(axiosMock.history.post.length).toBe(0);
  });

  test.each([
    { input: { flagsmithEnvKey: 'someEnvironmentKey', flagsmithProjectId: 'someProjectId', flagsmithApiToken: 'someApiToken' } },
    {
      input: {
        flagsmithEnvKey: 'someEnvironmentKey', flagsmithProjectId: 'someProjectId', flagsmithApiToken: 'someApiToken', scanPath: 'someDir/someChild',
      },
    },
    // {
    //   input: {
    //     flagsmithEnvKey: 'someEnvironmentKey', flagsmithProjectId: 'someProjectId', flagsmithApiToken: 'someApiToken', fileName: 'FEATURE-BOM',
    //   },
    // },
    {
      input: {
        flagsmithEnvKey: 'someEnvironmentKey', flagsmithProjectId: 'someProjectId', flagsmithApiToken: 'someApiToken', namePrefix: 'PREFIX-', nameSuffix: '-SUFFIX',
      },
    },
  ])('Should find and update feature for input: %o', async (test) => {
    jest.spyOn(fspromsies, 'readdir').mockResolvedValue([
      { name: 'testFile', isDirectory: () => false },
      { name: test.input.fileName, isDirectory: () => false },
    ]);
    jest.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify({ some: 'data' }));
    axiosMock
      .onGet(`https://api.flagsmith.com/api/v1/environments//${test.input.flagsmithEnvKey}/featurestates/?feature_name=utils`)
      .reply(200, { results: [{ id: 'some-feature-state-id' }] });
    axiosMock
      .onPatch(`https://api.flagsmith.com/api/v1/environments/${test.input.flagsmithEnvKey}/featurestates/some-feature-state-id`)
      .reply(200);

    core.getInput = jest
      .fn()
      .mockReturnValueOnce(test.input.flagsmithEnvKey)
      .mockReturnValueOnce(test.input.flagsmithProjectId)
      .mockReturnValueOnce(test.input.flagsmithApiToken)
      .mockReturnValueOnce(test.input.flagsmithApiUrl)
      .mockReturnValueOnce(test.input.scanPath)
      .mockReturnValueOnce(test.input.fileName)
      .mockReturnValueOnce(test.input.namePrefix)
      .mockReturnValueOnce(test.input.nameSuffix);

    await expect(setup()).toResolve();
  });

  test.each([
    { flagsmithProjectId: 'someProjectId', flagsmithApiToken: 'someApiToken' },
    { flagsmithEnvKey: 'someEnvironmentKey', flagsmithApiToken: 'someApiToken' },
    { flagsmithEnvKey: 'someEnvironmentKey', flagsmithProjectId: 'someProjectId' },
  ])('invalid input %o', async (input) => {
    core.getInput = jest
      .fn()
      .mockReturnValueOnce(input.flagsmithEnvKey)
      .mockReturnValueOnce(input.flagsmithProjectId)
      .mockReturnValueOnce(input.flagsmithApiToken)
      .mockReturnValueOnce(input.flagsmithApiUrl)
      .mockReturnValueOnce(input.scanPath)
      .mockReturnValueOnce(input.fileName)
      .mockReturnValueOnce(input.namePrefix)
      .mockReturnValueOnce(input.nameSuffix);

    await expect(setup).rejects.toThrow(Error);
  });
});

const core = require('@actions/core');
const { getInputOrDefault, getRequiredInput } = require('./getInput');

describe('getInputOrDefault Test', () => {
  test('Returns Valid Value', async () => {
    const name = 'version';
    const pattern = /^[\d.*]+$/;
    const defaultValue = '0.*';
    const expectedReturnValue = '0.44.4';

    jest.spyOn(core, 'getInput').mockImplementation(() => expectedReturnValue);
    const userInputs = await getInputOrDefault(name, pattern, defaultValue);
    expect(userInputs).toStrictEqual('0.44.4');
  });

  test('Handles Unsuccessul Value', async () => {
    const name = 'version';
    const pattern = /^[\d.*]+$/;
    const defaultValue = '0.*';
    const expectedReturnValue = 'bbgerbgreiugbreiugbire';

    jest.spyOn(core, 'getInput').mockImplementation(() => expectedReturnValue);

    try {
      await getInputOrDefault(name, pattern, defaultValue);
    } catch (e) {
      expect(e.message).toStrictEqual(`${name} doesn't match ${pattern}`);
    }
  });

  test('Handles Default Value', async () => {
    const name = 'version';
    const pattern = /^[\d.*]+$/;
    const defaultValue = '0.*';
    const expectedReturnValue = undefined;

    jest.spyOn(core, 'getInput').mockImplementation(() => expectedReturnValue);

    try {
      await getInputOrDefault(name, pattern, defaultValue);
    } catch (e) {
      expect(e.message).toStrictEqual('0.*');
    }
  });

  test('Handles Null Default Value', async () => {
    const name = 'version';
    const pattern = /^.*$/;
    const expectedReturnValue = undefined;

    jest.spyOn(core, 'getInput').mockImplementation(() => expectedReturnValue);

    try {
      await getInputOrDefault(name, pattern);
    } catch (e) {
      expect(e.message).toStrictEqual(null);
    }
  });
});

describe('getRequiredInput Test', () => {
  test('Handles Unsuccessul Value', async () => {
    const name = 'version';
    const pattern = /^[\d.*]+$/;
    const expectedReturnValue = 'bbgerbgreiugbreiugbire';

    jest.spyOn(core, 'getInput').mockImplementation(() => expectedReturnValue);

    try {
      await getRequiredInput(name, pattern);
    } catch (e) {
      expect(e.message).toStrictEqual(`${name} doesn't match ${pattern}`);
    }
  });

  test('Returns Valid Value', async () => {
    const name = 'version';
    const pattern = /^[\d.*]+$/;
    const expectedReturnValue = '0.44.4';

    jest.spyOn(core, 'getInput').mockImplementation(() => expectedReturnValue);
    const userInputs = await getRequiredInput(name, pattern);
    expect(userInputs).toStrictEqual('0.44.4');
  });
});

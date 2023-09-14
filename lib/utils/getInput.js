const core = require('@actions/core');

exports.getInputOrDefault = (name, pattern, defaultValue = null) => {
  const value = core.getInput(name) || defaultValue;
  if (pattern && !pattern.test(value)) {
    throw new Error(`${name} doesn't match ${pattern}`);
  }
  return value;
};

exports.getRequiredInput = (name, pattern) => {
  const value = core.getInput(name, { required: true });
  if (pattern && !pattern.test(value)) {
    throw new Error(`${name} doesn't match ${pattern}`);
  }
  return value;
};

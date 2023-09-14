const core = require('@actions/core');
const setup = require('./lib/setup');

(async () => {
  try {
    core.debug('Beginning Flagsmith Feature Flag Action');
    await setup();
    core.debug('Completed adding feature flags');
  } catch (error) {
    core.setFailed(error.message);
  }
})();

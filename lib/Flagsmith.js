const axios = require('axios');

const newFeatureEndpoint = (baseUrl, projectId) => `${baseUrl}/projects/${projectId}/features/`;
const featureStatesEndpoint = (baseUrl, environmentKey) => `${baseUrl}/environments/${environmentKey}/featurestates`;
const featureStateEndpoint = (baseUrl, environmentKey, featureStateId) => `${featureStatesEndpoint(baseUrl, environmentKey)}/${featureStateId}`;

class FlagsmithAPI {
  #apiToken;

  #baseUrl;

  #environmentKey;

  #projectId;

  constructor({
    apiUrl, environmentKey, projectId, apiToken,
  }) {
    this.#apiToken = apiToken;
    this.#baseUrl = apiUrl;
    this.#environmentKey = environmentKey;
    this.#projectId = projectId;
  }

  async createFeature(featureName, featureValue) {
    const newFeature = {
      name: featureName,
      description:
        'Created by Github Actions from version controlled value file',
      // tags,
      initial_value: featureValue,
      default_enabled: false,
    };

    await axios.post(
      newFeatureEndpoint(this.#baseUrl, this.#projectId),
      newFeature,
      { headers: { Authorization: `Token ${this.#apiToken}` } },
    );
  }

  async getFeatureState(featureName) {
    return axios
      .get(
        `${featureStatesEndpoint(
          this.#baseUrl,
          this.#environmentKey,
        )}/?feature_name=${featureName}`,
      )
      .then((response) => response.data.results[0].id);
  }

  async updateFeatureState(featureStateId, featureValue) {
    const updateFeature = {
      feature_state_value: featureValue,
    };

    await axios.patch(
      featureStateEndpoint(this.#baseUrl, this.#environmentKey, featureStateId),
      updateFeature,
      { headers: { Authorization: `Token ${this.#apiToken}` } },
    );
  }
}

module.exports = FlagsmithAPI;

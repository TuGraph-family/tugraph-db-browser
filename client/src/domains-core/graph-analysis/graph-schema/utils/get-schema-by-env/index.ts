/** 根据环境获得schema */
export const getSchemaByEnv = (
  allEnvSchema: API.PlatformModelSchemaVO,
  env: API.GraphDeployEnvEnum,
) => {
  switch (env) {
    case 'OFFLINE_TEST':
      return allEnvSchema?.devVisualModelDataVO || {};
    case 'ONLINE_GRAY':
      return allEnvSchema?.grayVisualModelDataVO || {};
    case 'ONLINE_PRODUCTION':
      return allEnvSchema?.prodVisualModelDataVO || {};
    default:
      return { nodes: [], edges: [] };
  }
};

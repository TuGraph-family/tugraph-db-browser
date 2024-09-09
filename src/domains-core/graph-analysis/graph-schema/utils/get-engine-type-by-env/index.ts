export const getEngineTypeByEnv = (
  graphProjectInfo: API.GeaMakerProjectVO,
  env: API.GraphDeployEnvEnum,
): API.SchemaEngineTypeEnum => {
  switch (env) {
    case 'OFFLINE_TEST':
      return graphProjectInfo?.devEngineTypeEnum || 'geamaker_geabase';
    case 'ONLINE_GRAY':
      return graphProjectInfo?.grayEngineTypeEnum || 'geamaker_geabase';
    case 'ONLINE_PRODUCTION':
      return graphProjectInfo?.prodEngineTypeEnum || 'geamaker_geabase';
    default:
      return 'geamaker_geabase';
  }
};

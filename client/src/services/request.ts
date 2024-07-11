import { dbRecordsTranslator } from '@/translator';
import { IRequestParams, ISessionParams } from '@/types/services';

export const request = async (params: IRequestParams) => {
  const { driver, cypher, graphName, parameters = {} } = params;
  if (!cypher) {
    return {};
  }

  const sessionParams: ISessionParams = {};
  if (graphName) {
    sessionParams.database = graphName;
  }

  const session = driver.session(sessionParams);


  return session
    .run(cypher, parameters)
    .then(result => {
      return {
        success: true,
        ...dbRecordsTranslator(result),
      };
    })
    .catch(e => {
      return {
        success: false,
        errorMessage: e,
      };
    })
    .finally(() => {
      session.close();
    });
};

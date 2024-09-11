import { dbRecordsTranslator } from '@/translator';
import {
  IRequestParams,
  ISessionParams,
  RestFulResponse,
} from '@/types/services';

export const request = async (
  params: IRequestParams,
): Promise<RestFulResponse> => {
  const { driver, cypher, graphName, parameters = {} } = params;

  if (!cypher) {
    return {
      success: false,
    };
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
        errorMessage: e?.message || e,
      };
    })
    .finally(() => {
      session.close();
    });
};

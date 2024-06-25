import { dbRecordsTranslator } from '@/translator';
import { Driver } from 'neo4j-driver';

export const request = async (
  driver: Driver,
  cypher: string,
  graphName = 'default',
) => {
  const session = driver.session({
    database: graphName,
  });

  return session
    .run(cypher)
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

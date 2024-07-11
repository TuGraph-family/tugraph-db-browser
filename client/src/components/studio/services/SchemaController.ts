import { LabelSchema,  } from '../interface/schema';
import { createSchema } from '@/services/schema';
import { Driver } from 'neo4j-driver';


export async function createLabelSchema(driver:Driver,params: LabelSchema) {
  const param = {
    graphName: params?.graphName,
    labelType: params?.labelType,
    labelName: params?.labelName,
    properties: params?.properties,
    ...(params?.labelType === 'node'
      ? { primaryField: params?.primaryField, indexs: params?.indexs }
      : { edgeConstraints: params?.edgeConstraints }),
  };
  return createSchema(driver,param);
}


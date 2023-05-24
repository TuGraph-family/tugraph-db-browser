import { isString } from 'lodash';
import { IEdgeDataParams } from '../service/tugraph/interface';

export const cypherValueFormatter = (value: any) => {
  return isString(value) ? `'${value}'` : value;
};

export const edgeMatchConditionFormatter = (params: IEdgeDataParams) => {
  const {
    sourceLabel,
    targetLabel,
    sourcePrimaryKey,
    sourceValue,
    targetPrimaryKey,
    targetValue,
    labelName,
  } = params;
  const sourceValueString = cypherValueFormatter(sourceValue);
  const targetValueString = cypherValueFormatter(targetValue);

  return `MATCH (n:${sourceLabel} {${sourcePrimaryKey}: ${sourceValueString}})-[r:${labelName}]-(m:${targetLabel} {${targetPrimaryKey}: ${targetValueString}})`;
};

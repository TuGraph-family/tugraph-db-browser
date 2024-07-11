import { Driver } from 'neo4j-driver';
import { request } from './request';

import { upsertEdge, upsertVertex } from '@/queries/schema';
import { FileSchema } from '@/types/services';
import { parseCsv } from '@/components/studio/utils/parseCsv';
import { convertToNumber } from '@/utils';

/* 创建模版数据导入 */
const mapUpload = async (params: {
  schema: FileSchema[];
  idx?: number;
  driver: Driver;
  graphName: string;
  delimiter: string;
}) => {
  const { schema, idx = 0, driver, graphName, delimiter } = params;
  if (schema?.length === 0) {
    return {
      success: true,
    };
  }
  const fileItem = schema[idx];

  let csvData: any = [];
  if (fileItem?.file) {
    csvData = await parseCsv(fileItem?.file, delimiter);
  } else {
    csvData = await fetch(`${window.location.origin}${fileItem.path}`)
      .then(res => res.blob())
      .then(res => parseCsv(res));
  }

  const head = fileItem?.header || 0;

  const list = csvData
    ?.splice(head)
    ?.filter(item => item[0])
    ?.map(itemList => {
      let itemVal = {};
      let columns = fileItem.columns;

      columns?.forEach((keys, index) => {
        const itemContent = itemList[index];
        const type = fileItem?.properties?.find(
          itemType => itemType.name === keys,
        )?.type || '';

        let newKey = keys;

        switch (keys) {
          case 'SRC_ID':
            newKey = `${fileItem.SRC_ID}_src`;
            break;
          case 'DST_ID':
            newKey = `${fileItem.DST_ID}_dst`;
            break;
          default:
            break;
        }
        itemVal[newKey] = convertToNumber(itemContent, type);
      });

      return itemVal;
    });


  const cypher =
    fileItem.type === 'vertex'
      ? upsertVertex(fileItem.label)
      : upsertEdge(fileItem.label);
  const param = {
    driver,
    cypher,
    graphName,
    parameters: { data: list },
  };
  if (fileItem.type === 'edge') {
    const { SRC_ID, DST_ID } = fileItem;
    const SRC = { type: SRC_ID, key: `${SRC_ID}_src` };
    const DST = { type: DST_ID, key: `${DST_ID}_dst` };
    param.parameters = {
      data: list,
      SRC,
      DST,
    };
  }

  const result = await request(param);

  if (result?.success && idx <= schema.length - 2) {
    return mapUpload({
      schema,
      idx: idx + 1,
      driver,
      graphName,
      delimiter,
    });
  } else {
    return result;
  }
};

/* 导入数据 */

export const importData = async (params: {
  driver: Driver;
  graphName: string;
  files: FileSchema[];
  delimiter?: string;
}) => {
  const { driver, graphName, files, delimiter = ',' } = params;
  const dataList: FileSchema[] = [];

  files.forEach(item => {
    if ('SRC_ID' in item) {
      dataList.push({
        ...item,
        type: 'edge',
      });
    } else {
      dataList.unshift({
        ...item,
        type: 'vertex',
      });
    }
  });

  const vertexResult = await mapUpload({
    schema: dataList,
    driver,
    graphName,
    delimiter,
  });

  return vertexResult;
};

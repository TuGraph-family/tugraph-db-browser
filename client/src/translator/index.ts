import { QueryResult, RecordShape, isInt } from 'neo4j-driver';

export const dbConfigRecordsTranslator = (
  records: QueryResult<RecordShape>['records'],
) => {
  if (!records) {
    return {};
  }
  return records.reduce(
    (map, cur) => {
      const { _fields: fields } = cur;
      const name = fields[0];
      const value = fields[1];
      map[name] = isInt(value) ? value.toNumber() : value.toString();
      return map;
    },
    {} as Record<string, any>,
  );
};

export const dbRecordsTranslator = (result: QueryResult<RecordShape>) => {
  return {
    data: result?.records.map(record => {
      const { _fields: fields, keys } = record;
      const item: Record<string, any> = {};
      keys.forEach((key: string, index: number) => {
        try {
          item[key] = JSON.parse(fields[index]);
        } catch (e) {
          item[key] = fields[index];
        }
      });
      return item;
    }),
  };
};

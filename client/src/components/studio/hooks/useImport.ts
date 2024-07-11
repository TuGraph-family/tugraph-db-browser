import { useRequest } from 'ahooks';
import { importSchemaMod } from '@/services/schema';
import { useModel } from 'umi';
import { InitialState } from '@/app';
import { importData } from '@/services/info';

export const useImport = () => {
  const { initialState } = useModel('@@initialState');
  const { driver } = initialState as InitialState;

  const {
    runAsync: onImportData,
    loading: importDataLoading,
    error: importDataError,
  } = useRequest(params => importData({ driver, ...params }), { manual: true });

 

  const {
    runAsync: onImportGraphSchema,
    loading: ImportGraphSchemaLoading,
    error: ImportGraphSchemaError,
  } = useRequest(params => importSchemaMod(driver, params), { manual: true });

  return {
    useImport,
    importDataLoading,
    onImportData,
    importDataError,
    onImportGraphSchema,
    ImportGraphSchemaLoading,
    ImportGraphSchemaError,
  };
};

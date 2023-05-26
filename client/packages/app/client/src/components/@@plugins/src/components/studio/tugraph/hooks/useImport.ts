import { useRequest } from 'ahooks';
import { importData, importSchema, importProgress } from '../services/ImportController';

export const useImport = () => {
  const {
    runAsync: onImportData,
    loading: importDataLoading,
    error: importDataError,
  } = useRequest(importData, { manual: true });

  const {
    runAsync: onImportSchema,
    loading: importSchemaLoading,
    error: importSchemaError,
  } = useRequest(importSchema, { manual: true });

  const {
    runAsync: onImportProgress,
    loading: importProgressLoading,
    error: importProgressError,
    cancel: importProgressCancel,
  } = useRequest(importProgress, { manual: true, pollingInterval: 5000 });

  return {
    useImport,
    importDataLoading,
    onImportData,
    importDataError,
    onImportSchema,
    importSchemaLoading,
    importSchemaError,
    onImportProgress,
    importProgressLoading,
    importProgressError,
    importProgressCancel,
  };
};

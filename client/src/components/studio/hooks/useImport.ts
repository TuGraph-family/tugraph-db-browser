import { useRequest } from 'ahooks';
import {
  importData,
  importGraphSchema,
  importProgress,
  importSchema,
} from '../services/ImportController';

export const useImport = (params?: {
  onImportProgressSuccess?: (data: any, success: any) => void;
}) => {
  const { onImportProgressSuccess } = params || {};
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
  } = useRequest(importProgress, {
    manual: true,
    pollingInterval: 3000,
    onSuccess: onImportProgressSuccess,
  });

  const {
    runAsync: onImportGraphSchema,
    loading: ImportGraphSchemaLoading,
    error: ImportGraphSchemaError,
  } = useRequest(importGraphSchema, { manual: true });

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
    onImportGraphSchema,
    ImportGraphSchemaLoading,
    ImportGraphSchemaError,
  };
};

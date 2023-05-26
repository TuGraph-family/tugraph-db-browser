import { uploadFile, checkFile } from '../services/FileController';
import { useRequest } from 'ahooks';

export const useUpload = () => {
  const {
    runAsync: onUpload,
    loading: uploadLoading,
    error: uploadError,
  } = useRequest(uploadFile, { manual: true, retryCount: 2 });

  const { runAsync: onCheck, loading: checkLoading, error: checkError } = useRequest(checkFile, { manual: true });
  return {
    onUpload,
    uploadLoading,
    uploadError,
    onCheck,
    checkLoading,
    checkError,
  };
};

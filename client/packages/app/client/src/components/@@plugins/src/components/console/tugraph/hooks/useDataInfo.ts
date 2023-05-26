import {
    getDatabaseInfo,
    getSystemInfo,
  } from "../services/DataInfoController";
  import { useRequest } from "ahooks";
  
  export const useDataInfo = () => {
    const {
        runAsync: onGetDatabaseInfo,
        loading: getDatabaseInfoLoading,
        error: getDatabaseInfoError,
      } = useRequest(getDatabaseInfo, { manual: true });

      const {
        runAsync: onGetSystemInfo,
        loading: getSystemInfoLoading,
        error: getSystemInfoError,
      } = useRequest(getSystemInfo, { manual: true });

      return {
        onGetDatabaseInfo,
        getDatabaseInfoLoading,
        getDatabaseInfoError,
        onGetSystemInfo,
        getSystemInfoLoading,
        getSystemInfoError
      }
    }
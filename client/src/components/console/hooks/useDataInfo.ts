import { useModel } from "umi";

  import { useRequest } from "ahooks";
import { InitialState } from "@/app";
import { getDatabaseInfo, getSystemInfo } from "@/queries/info";
import { request } from "@/services/request";
  
  export const useDataInfo = () => {
    const { initialState } = useModel('@@initialState');
    const { driver } = initialState as InitialState;
    const {
        runAsync: onGetDatabaseInfo,
        loading: getDatabaseInfoLoading,
        error: getDatabaseInfoError,
      } = useRequest(()=>request(driver,getDatabaseInfo()), { manual: true });

      const {
        runAsync: onGetSystemInfo,
        loading: getSystemInfoLoading,
        error: getSystemInfoError,
      } = useRequest(()=>request(driver,getSystemInfo()), { manual: true });

      return {
        onGetDatabaseInfo,
        getDatabaseInfoLoading,
        getDatabaseInfoError,
        onGetSystemInfo,
        getSystemInfoLoading,
        getSystemInfoError
      }
    }
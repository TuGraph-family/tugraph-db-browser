import { useModel } from "umi";

  import { useRequest } from "ahooks";
import { InitialState } from "@/app";
import { getDatabaseInfo, getSystemInfo } from "@/queries/info";
  
  export const useDataInfo = () => {
    const { initialState } = useModel('@@initialState');
    const { session } = initialState as InitialState;
    const {
        runAsync: onGetDatabaseInfo,
        loading: getDatabaseInfoLoading,
        error: getDatabaseInfoError,
      } = useRequest(()=>session.run(getDatabaseInfo()), { manual: true });

      const {
        runAsync: onGetSystemInfo,
        loading: getSystemInfoLoading,
        error: getSystemInfoError,
      } = useRequest(()=>session.run(getSystemInfo()), { manual: true });

      return {
        onGetDatabaseInfo,
        getDatabaseInfoLoading,
        getDatabaseInfoError,
        onGetSystemInfo,
        getSystemInfoLoading,
        getSystemInfoError
      }
    }
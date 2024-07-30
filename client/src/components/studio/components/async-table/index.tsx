import { useRequest } from 'ahooks';
import type { PaginationProps, TableColumnsType, TableProps } from 'antd';
import { Table } from 'antd';
import { isEqual } from 'lodash';
import React, { useCallback, useEffect } from 'react';
import { useImmer } from 'use-immer';

export interface AsyncTableProps {
  service: (requestParams?: any, requestBody?: any) => Promise<any>;
  columns: TableColumnsType<any>;
  requestParams?: any;
  requestBody?: any;
  tableProps?: TableProps<any>;
  paginationProps?: PaginationProps;
  refreshDeps?: any[];
  serviceFlag?: boolean;
}

const defaultParams = {
  current: 1,
  pageSize: 10,
};

interface ListType {
  currentPage?: number;
  /** 分页大小 */
  pageSize?: number;
  /** 总数 */
  totalCount?: number;
  /** 查询结果列表 */
  list?: any[];
}

const getHasValueObj = (obj?: { [key: string]: any }) => {
  if (!obj) {
    return;
  }
  const newObj: { [key: string]: any } = {};
  for (const key in obj) {
    if (obj[key]) {
      newObj[key] = obj[key];
    }
  }
  return newObj;
};

const AsyncTable: React.FC<AsyncTableProps> = ({
  service,
  columns,
  requestBody,
  tableProps,
  paginationProps,
  requestParams,
  refreshDeps,
  serviceFlag,
}) => {
  const [state, setState] = useImmer<{
    dataSource: any[];
    total: number;
    current: number;
    pageSize: number;
    body?: any;
    params?: any;
    isFirstLoad: boolean;
  }>({
    dataSource: [],
    total: 0,
    ...defaultParams,
    isFirstLoad: true,
  });
  const { dataSource, total, body, params, isFirstLoad, } =
    state;
  const { run: requestData, loading } = useRequest(service, {
    manual: true,
  });
  useEffect(() => {
    const hasValueBody = getHasValueObj(body);
    const hasValueRequestBody = getHasValueObj(requestBody);
    const hasValueParams = getHasValueObj(params);
    const hasValueRequestParams = getHasValueObj(requestParams);
    if (
      !isEqual(hasValueBody, hasValueRequestBody) ||
      !isEqual(hasValueParams, hasValueRequestParams)
    ) {
      setState(draft => {
        draft.body = requestBody;
        draft.params = requestParams;
      });
    }
  }, [requestParams, requestBody]);
  useEffect(() => {
    if (!isFirstLoad || (!requestParams && !requestBody)) {
    }
  }, [...(refreshDeps || [])]);

  const onPageChange = useCallback(
    (current: number, size: number) => {
      setState(draft => {
        draft.current = current;
        draft.pageSize = size;
      });
    },
    [requestParams, requestBody],
  );
  const showTotal = useCallback((totalNumber: number) => {
    return `共${totalNumber}条`;
  }, []);

  return (
    <Table
      {...tableProps}
      loading={loading}
      columns={columns}
      dataSource={dataSource}
      pagination={{
        current: state.current,
        pageSize: state.pageSize,
        total,
        onChange: onPageChange,
        showTotal: showTotal,
        showQuickJumper: true,
        showSizeChanger: true,
        ...paginationProps,
      }}
    />
  );
};

export default AsyncTable;

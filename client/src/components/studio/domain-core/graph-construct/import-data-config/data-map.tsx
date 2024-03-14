import { graphDataToOptions } from '@/components/studio/utils/dataImportTransform';
import { batchSecureDeletion } from '@/components/studio/utils/objectOper';
import { Select, Cascader, InputNumber, Table } from 'antd';
import { useEffect, useState } from 'react';

const DataMapConfigHeader = ({
  state,
  setState,
  data,
  setFileDataList,
  fileDataList,
}: any) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          width: '60%',
        }}
      >
        <span
          style={{
            width: 'max-content',
            display: 'inline-block',
            whiteSpace: 'nowrap',
          }}
        >
          标签：
        </span>
        <Cascader
          size="small"
          key="dataMap"
          placeholder="请选择"
          options={state?.labelOptions}
          onChange={(value: any) => {
            const isEdges = [...value][0] === 'edge';
            const curEdgeColumns = ['SRC_ID', 'DST_ID'];
            const curNodeColumns = new Array(data?.data?.columns?.length).fill(
              '',
            );
            const newFileDataList = [...fileDataList].map((cur: any) => {
              if (data?.fileName === cur?.fileName) {
                const curLabel = [...value][1] || '';
                const preFileSchema = data?.fileSchema;
                return {
                  ...cur,
                  fileSchema: {
                    ...preFileSchema,
                    label: curLabel,
                    columns: isEdges ? curEdgeColumns : curNodeColumns,
                    ...(isEdges
                      ? { SRC_ID: '', DST_ID: '' }
                      : {
                          format: preFileSchema?.format,
                          header: preFileSchema?.header,
                          path: preFileSchema?.path,
                        }),
                  },
                };
              }
              return cur;
            });
            setFileDataList(newFileDataList);
            setState((pre: any) => {
              return { ...pre, nodeType: value };
            });
          }}
        />
      </div>
      <div
        style={{
          width: '40%',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
        }}
      >
        <span
          style={{
            width: 'max-content',
            display: 'inline-block',
            whiteSpace: 'nowrap',
          }}
        >
          从第
        </span>
        <InputNumber
          defaultValue={0}
          size="small"
          onChange={value => {
            const newFileDataList = [...fileDataList].map((cur: any) => {
              const { header, ...other } = cur?.fileSchema;
              if (data?.fileName === cur?.fileName) {
                return {
                  ...data,
                  fileSchema: {
                    ...other,
                    header: Number(value) || 0,
                  },
                };
              }
              return cur;
            });
            setFileDataList(newFileDataList);
          }}
        />
        <span
          style={{
            width: 'max-content',
            display: 'inline-block',
            whiteSpace: 'nowrap',
          }}
        >
          行开始
        </span>
      </div>
    </div>
  );
};
const DataMapSelectNav = ({
  state,
  setFileDataList,
  data,
  fileDataList,
}: any) => {
  const [visibility, setVisibility] = useState<boolean>(true);
  const [defaultSelectValue, setDefaultSelectValue] = useState<string[]>(['']);
  const isEdges = [...state?.nodeType][0] === 'edge';
  useEffect(() => {
    setVisibility(!isEdges);
    if (!isEdges) {
      batchSecureDeletion(data, ['SRC_ID', 'DST_ID']);
    }
  }, [state?.nodeType[0]]);
  useEffect(() => {
    setDefaultSelectValue(new Array(state?.columns?.length).fill(''));
  }, [state?.nodeType[1]]);
  return visibility ? (
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: '16px',
        padding: '12px',
        paddingTop: 0,
        overflowX: 'auto',
        maxWidth: '100%',
        width: '100%',
      }}
    >
      {[...state?.columns].map((item, index) => (
        <Select
          key={item?.key}
          value={defaultSelectValue[index] || ''}
          options={[...state?.nodeType][0] ? state?.propertiesOptions : []}
          style={{
            minWidth: 120,
          }}
          onChange={value => {
            const newFileDataList = [...fileDataList].map(cur => {
              const curColumns = Array.isArray(cur?.fileSchema?.columns)
                ? cur?.fileSchema?.columns
                : [];
              curColumns[index] = value || '';
              if (data?.fileName === cur?.fileName) {
                return {
                  ...cur,
                  fileSchema: {
                    ...cur?.fileSchema,
                    columns: isEdges ? cur?.fileSchema?.columns : curColumns,
                  },
                };
              }
              return cur;
            });
            setFileDataList(newFileDataList);
            setDefaultSelectValue(pre => {
              const slicePre = pre.slice(0);
              slicePre[index] = value;
              return slicePre;
            });
          }}
        />
      ))}
    </div>
  ) : null;
};

const DataMapTableView = ({ state }: any) => {
  return (
    <>
      <div
        style={{
          justifyContent: 'flex-start',
          alignItems: 'center',
          gap: '12px',
          marginTop: 0,
          overflowX: 'auto',
          maxWidth: '100%',
          width: '100%',
          paddingBottom: 0,
          borderBottom: '1px solid #f0f0f0',
          display: 'flex',
        }}
      >
        {[...state?.labelList].map(item => {
          return (
            <div
              style={{
                color: 'rgba(0, 0, 0, 0.85)',
                fontWeight: 500,
                textAlign: 'left',
                padding: '16px',
                gap: '12px',
              }}
              key={item?.key}
            >
              {item?.title}
            </div>
          );
        })}
      </div>
      <Table
        columns={state.columns}
        dataSource={state?.list}
        pagination={false}
      />
    </>
  );
};
const DataMap = ({
  data,
  graphData,
  setFileDataList,
  fileDataList,
}: {
  data: any;
  graphData: any;
  setFileDataList: any;
  fileDataList: any;
}) => {
  const [state, setState] = useState<any>({
    columns: [],
    list: [],
    labelList: [],
    labelOptions: [],
    nodeType: ['', ''],
    propertiesOptions: [],
  });

  useEffect(() => {
    const dataSource: any[] = data?.data?.dataSource || [];
    const curLabelOptions: any[] = data?.labelOptions || [];
    const labelHeader = dataSource[0];
    const dataColumns = dataSource[1];
    const dataList = dataSource.slice(2);
    if (dataSource.length) {
      const curColumns = Object.entries(dataColumns).map(([key, value]) => {
        return {
          key,
          title: value,
          dataIndex: key,
        };
      });
      const curLabelList = Object.entries(labelHeader).map(([key, value]) => {
        return {
          key,
          title: value,
          dataIndex: key,
        };
      });
      setState({
        ...state,
        list: dataList,
        columns: curColumns,
        labelList: curLabelList,
        labelOptions: curLabelOptions,
      });
    }
  }, [data]);
  useEffect(() => {
    if (data && data?.data?.dataSource?.length) {
      const dataSource: any[] = data?.data?.dataSource || [];
      const dataColumns = dataSource[1];
      const dataColumnsTitle = ['起点', '终点'];
      const isNode = ['node', ''].includes(state?.nodeType[0]);
      const curColumns = Object.entries(dataColumns).map(
        ([key, value], index) => {
          return {
            key,
            title: isNode ? value : dataColumnsTitle[index],
            dataIndex: key,
          };
        },
      );
      setState((pre: any) => {
        return {
          ...pre,
          propertiesOptions: graphDataToOptions({
            graphData,
            type: state?.nodeType[0] || '',
            label: state?.nodeType[1] || '',
          }),
          columns: curColumns,
        };
      });
    }
  }, [data, state?.nodeType[0], state?.nodeType[1]]);
  return (
    <div
      style={{
        background: '#fff',
      }}
    >
      <DataMapConfigHeader
        data={data}
        state={state}
        setState={setState}
        setFileDataList={setFileDataList}
        fileDataList={fileDataList}
      />
      <DataMapSelectNav
        data={data}
        state={state}
        setState={setState}
        graphData={graphData}
        setFileDataList={setFileDataList}
        fileDataList={fileDataList}
      />
      <DataMapTableView state={state} />
    </div>
  );
};

export default DataMap;

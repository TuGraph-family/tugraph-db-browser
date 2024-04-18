import { graphDataToOptions } from '@/components/studio/utils/dataImportTransform';
import { batchSecureDeletion } from '@/components/studio/utils/objectOper';
import { Select, Cascader, InputNumber, Tooltip, Typography } from 'antd';
import { useEffect, useState } from 'react';
const { Paragraph } = Typography;
const isUrl =
  /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;

const getMaxLength = (list: any[]): number => {
  return list.length * 120;
};

const checkFullArray = (data: any) => {
  return Array.isArray(data) && data?.length > 0;
};

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
        padding: 12,
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
        gap: 12,
        padding: 12,
        paddingTop: 0,
        paddingBottom: 0,
        width: getMaxLength([...state?.columns]),
      }}
    >
      {checkFullArray(state?.columns)
        ? [...state?.columns].map((item, index) => (
            <Select
              key={item?.key}
              value={defaultSelectValue[index] || ''}
              options={[...state?.nodeType][0] ? state?.propertiesOptions : []}
              style={{
                width: 120,
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
                        columns: isEdges
                          ? cur?.fileSchema?.columns
                          : curColumns,
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
          ))
        : null}
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
          gap: 12,
          marginTop: 12,
          width: getMaxLength([...state?.labelList]),
          paddingBottom: 0,
          borderBottom: '1 solid #f0f0f0',
          display: 'flex',
          background: '#fafafa',
        }}
      >
        {checkFullArray(state?.labelList)
          ? [...state?.labelList].map((item, index) => {
              return (
                <div
                  style={{
                    color: 'rgba(0, 0, 0, 0.85)',
                    fontWeight: 500,
                    textAlign: 'left',
                    padding: 12,
                    gap: 12,
                    fontSize: 14,
                    width: 120,
                  }}
                  key={index}
                >
                  {item?.title}
                </div>
              );
            })
          : null}
      </div>
      <div
        style={{
          height: 55,
          position: 'relative',
          color: 'rgba(0, 0, 0, 0.85)',
          fontWeight: 500,
          textAlign: 'left',

          borderBottom: '1 solid #f0f0f0',
          display: 'flex',
          justifyContent: 'start',
          alignItems: 'center',
          gap: 12,
          width: getMaxLength([...state.columns]),
        }}
      >
        {checkFullArray(state.columns)
          ? [...state.columns].map((item: any, index: number) => (
              <Tooltip key={item?.title} title={item?.title}>
                <div
                  style={{
                    width: 120,
                    padding: 16,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                  key={index}
                >
                  {item?.title}
                </div>
              </Tooltip>
            ))
          : null}
      </div>
      <div>
        {checkFullArray(state?.list)
          ? [...state?.list].map((item: any, index: number, arr: any[]) => {
              return (
                <div
                  key={`row-${index}`}
                  style={{
                    width: getMaxLength([...state.columns]),
                    height: 55,
                    position: 'relative',
                    color: 'rgba(0, 0, 0, 0.85)',
                    fontWeight: 500,
                    textAlign: 'left',
                    background: '#fff',
                    borderBottom: '1 solid #fff',
                    display: 'flex',
                    justifyContent: 'start',
                    alignItems: 'center',
                    gap: 12,
                  }}
                >
                  {[...state.columns].map((it: any, inx: number) => {
                    const isUrlTestPass = isUrl.test(arr[index][`col${inx}`]);
                    if (isUrlTestPass) {
                      return (
                        <Paragraph
                          key={`col-${index}-${inx}`}
                          copyable={{
                            text: arr[index][`col${inx}`],
                            tooltips: ['点击复制', '复制成功'],
                          }}
                          style={{
                            display: 'flex',
                            color: '#1650ff',
                            width: 120,
                          }}
                        >
                          <a
                            onClick={() => {
                              window.open(arr[index][`col${inx}`], '_blank');
                            }}
                          >
                            链接
                          </a>
                        </Paragraph>
                      );
                    }
                    return (
                      <Tooltip
                        key={`col-${index}-${inx}`}
                        title={arr[index][`col${inx}`]}
                      >
                        <div
                          style={{
                            width: 120,
                            padding: 16,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {arr[index][`col${inx}`]}
                        </div>
                      </Tooltip>
                    );
                  })}
                </div>
              );
            })
          : null}
      </div>
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
      <div
        style={{
          padding: '0 12px',
          maxWidth: '100%',
          overflowX: 'auto',
          scrollbarWidth: 'none',
        }}
      >
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
    </div>
  );
};

export default DataMap;

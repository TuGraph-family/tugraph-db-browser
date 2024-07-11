import { graphDataToOptions } from '@/components/studio/utils/dataImportTransform';
import { batchSecureDeletion } from '@/components/studio/utils/objectOper';
import { getProperties } from '@/utils';
import { ProFormSlider } from '@ant-design/pro-components';
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
  graphData,
}: any) => {

  const getOption = () => {
    return graphData.nodes?.map(item => {
      return {
        label: item?.labelName,
        value: item?.labelName,
      };
    });
  };

  // 起点和终点类型选择
  const onSelect = (val: string, key: string) => {
    const newFileDataList =
      checkFullArray(fileDataList) &&
      [...fileDataList].map((cur: any) => {
        if (data?.fileName === cur?.fileName) {
          const fileSchema = cur?.fileSchema;
          return {
            ...cur,
            fileSchema: {
              ...fileSchema,
              [key]: val,
            },
          };
        }
        return cur;
      });
    setFileDataList(newFileDataList);
  };

  return (
    <>
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
            allowClear={false}
            defaultValue={data?.selectedValue || []}
            options={state?.labelOptions}
            onChange={(value: any, selectedOptions) => {
              const curColumns = new Array(data?.data?.columns?.length).fill(
                '',
              );
              const newFileDataList =
                checkFullArray(fileDataList) &&
                [...fileDataList].map((cur: any) => {
                  if (data?.fileName === cur?.fileName) {
                    const preFileSchema = data?.fileSchema;

                    delete preFileSchema.SRC_ID;
                    delete preFileSchema.DST_ID;
                
                    const properties = getProperties({
                      type: value[0],
                      name: value[1],
                      graphData,
                    });
                    return {
                      ...cur,
                      fileSchema: {
                        ...preFileSchema,
                        columns: curColumns,
                        ...selectedOptions?.[1],
                        properties,
                      },
                      selectedValue: value || ['', ''],
                    };
                  }
                  return cur;
                });
              setFileDataList(newFileDataList);
              setState((pre: any) => {
                return { ...pre, nodeType: value || ['', ''] };
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
            defaultValue={data?.fileSchema?.header || 0}
            size="small"
            onChange={value => {
              const newFileDataList =
                checkFullArray(fileDataList) &&
                [...fileDataList].map((cur: any) => {
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
      {state.nodeType[0] === 'edge' && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: 12
          }}
        >
          <div>
            <span style={{ marginRight: 10 }}>起点类型:</span>
            <Select
              value={data?.fileSchema?.SRC_ID}
              style={{ width: 100 }}
              options={getOption()}
              onChange={val => onSelect(val, 'SRC_ID')}
            />
          </div>
          <div>
            <span style={{ marginRight: 10 }}>终点类型:</span>
            <Select
            value={data?.fileSchema?.DST_ID}
              style={{ width: 100 }}
              options={getOption()}
              onChange={val => onSelect(val, 'DST_ID')}
            />
          </div>
        </div>
      )}
    </>
  );
};
const DataMapSelectNav = ({
  state,
  setFileDataList,
  data,
  fileDataList,
}: any) => {
  const [defaultSelectValue, setDefaultSelectValue] = useState<string[]>(['']);

  const isEdges = [...state?.nodeType][0] === 'edge';
  useEffect(() => {
    if (!isEdges) {
      batchSecureDeletion(data, ['SRC_ID', 'DST_ID']);
    }
  }, [state?.nodeType[0]]);
  useEffect(() => {
    const defaulColumns =
      data?.fileSchema?.columns || new Array(state?.columns?.length).fill('');
    setDefaultSelectValue(defaulColumns);
  }, [state?.nodeType[1]]);

  /* 边默认有SRC_ID/DST_ID */
  const options = isEdges
    ? [
        { value: 'SRC_ID', label: 'SRC_ID' },
        {
          value: 'DST_ID',
          label: 'DST_ID',
        },
        ...state?.propertiesOptions,
      ]
    : state?.propertiesOptions;

  return (
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
      key={'DataMapSelectNav'}
    >
      {checkFullArray(state?.columns)
        ? [...state?.columns].map((item, index) => (
            <Select
              key={index}
              value={defaultSelectValue[index] || ''}
              options={[...state?.nodeType][0] ? options : []}
              style={{
                width: 120,
              }}
              onChange={value => {
                const newFileDataList = [...fileDataList].map(cur => {
                  if (data?.fileName === cur?.fileName) {
                    const curColumns = Array.isArray(cur?.fileSchema?.columns)
                      ? cur?.fileSchema?.columns
                      : [];
                    curColumns[index] = value || '';
                    return {
                      ...cur,
                      fileSchema: {
                        ...cur?.fileSchema,
                        columns: curColumns,
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
  );
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
        }}
      >
        {checkFullArray(state?.labelList)
          ? [...state?.labelList].map((item, index) => {
              return item?.title ? (
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
                  {item?.title || ''}
                </div>
              ) : null;
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
          background: '#fafafa',
          borderBottom: '1 solid #f0f0f0',
          display: 'flex',
          justifyContent: 'start',
          alignItems: 'center',
          gap: 12,
          width: getMaxLength([...state?.columns]),
        }}
      >
        {checkFullArray(state.columns)
          ? [...state.columns].map((item: any, index: number) => (
              <Tooltip key={index} title={item?.title || ''}>
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
                  {item?.title || ''}
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
    const hasLabel = `${JSON.stringify(data)}`.includes('LABEL');
    let labelHeader, dataColumns, dataList;
    const dataSource: any[] = data?.data?.dataSource || [];
    const curLabelOptions: any[] = data?.labelOptions || [];
    if (hasLabel) {
      labelHeader = dataSource[0];
      dataColumns = dataSource[1];
      dataList = dataSource.slice(2);
    } else {
      labelHeader = [];
      dataColumns = dataSource[0];
      dataList = dataSource.slice(1);
    }
    if (dataSource?.length) {
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
    const hasLabel = `${JSON.stringify(data)}`.includes('LABEL');
    if (
      data &&
      data?.data?.dataSource?.length &&
      checkFullArray(state?.nodeType)
    ) {
      const dataSource: any[] = data?.data?.dataSource || [];
      const dataColumns = dataSource[hasLabel ? 1 : 0];
      const curColumns = Object.entries(dataColumns).map(
        ([key, value], index) => {
          return {
            key,
            title: value,
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
  }, [data, state?.nodeType]);
  return (
    <div
      style={{
        background: '#fff',
      }}
      key={`data-map_${data?.fileName}`}
    >
      <DataMapConfigHeader
        data={data}
        state={state}
        graphData={graphData}
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
        key={'dataMap-select-nav'}
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

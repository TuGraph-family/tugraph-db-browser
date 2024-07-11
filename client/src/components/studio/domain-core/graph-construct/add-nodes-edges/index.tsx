import { PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Button, Form, Input, Popconfirm, Tooltip, message } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { filter, map, uniq, xor } from 'lodash';
import React, { useEffect } from 'react';
import { useImmer } from 'use-immer';
import { EditTable } from '../../../components/edit-table';
import SwitchDrawer from '../../../components/switch-drawer';
import { DATA_TYPE, EditType, PUBLIC_PERFIX_CLASS } from '../../../constant';
import { useVisible } from '../../../hooks/useVisible';
import { AttrData, IndexData, StartData } from '../../../interface/schema';

import styles from './index.module.less';
import { getQueryParam } from '@/components/studio/utils/url';

type Prop = {
  type: 'node' | 'edge';
  data?: any;
  onFinish?: (value?: any) => void;
  onSwitch?: (onShow: () => void, onClose: () => void) => void;
  onVisible?: (visible: boolean) => void;
};
interface EditColumnsType<T> extends ColumnsType<T> {
  editorConfig: {
    inputType?: string;
    prop: {
      options: Array<{ label: string; value: string }>;
      mode: 'multiple' | 'tags';
      name?: boolean;
    };
  };
  editable: boolean;
}

export const AddNodesEdges: React.FC<Prop> = ({
  type,
  data = [],
  onFinish,
  onSwitch,
  onVisible,
}) => {
  const [form] = Form.useForm();
  const { visible, onShow, onClose } = useVisible({ defaultVisible: true });

  const [state, updateState] = useImmer<{
    startList: Array<StartData>;
    attrList: Array<AttrData>;
    configList: Array<IndexData>;
    isNode: boolean;
    isDocumentEdge: boolean;
  }>({
    startList: [],
    isNode: true,
    attrList: [],
    configList: [],
    isDocumentEdge: false,
  });
  const { startList, attrList, configList } = state;
  const isAllow = (record: any): boolean => {
    return state?.isNode && record?.primaryField;
  };

  const onReset=()=>{
    updateState({
      startList: [],
      isNode: true,
      attrList: [],
      configList: [],
      isDocumentEdge: false,
    })
  }
  useEffect(() => {
    onSwitch?.(onShow, onClose);
  }, []);
  useEffect(() => {
    onVisible?.(visible);
  }, [visible]);
  useEffect(() => {
    const at = getQueryParam('at');
    const isDocumentEdge = `${at}`.includes('document_edge');
    updateState(draft => {
      draft.isNode = type === 'node';
      draft.isDocumentEdge = isDocumentEdge;
      draft.attrList = isDocumentEdge
        ? []
        : [
            {
              id: 'primary-key',
              name: '',
              type: '',
              primaryField: true,
              optional: false,
            },
          ];
    });
  }, [type,visible]);

  const propertyList = () => {
    const attrPropertyNames = map(
      filter(attrList, attr => !attr.optional && !attr.primaryField),
      item => item.name,
    );
    const indexPropertyNames = map(configList, item => item.propertyName);
    return map(
      filter(
        xor(attrPropertyNames, indexPropertyNames),
        item => item ,
      ),
      item => ({ label: item, value: item }),
    );
  };
  const addButton = (handleAdd?: () => void, text: string = '添加属性') => {
    return (
      <Button
        className={styles[`${PUBLIC_PERFIX_CLASS}-container-addbtn`]}
        type="dashed"
        block
        onClick={handleAdd}
        icon={<PlusOutlined />}
      >
        {text}
      </Button>
    );
  };
  const colums: EditColumnsType<StartData> = [
    {
      title: '起点',
      dataIndex: 'source',
      key: 'source',
      editable: true,
      editorConfig: (record: StartData) => {
        return {
          inputType: EditType.SELECT,
          prop: {
            options: map(data.nodes, item => ({
              label: item.labelName,
              value: item.labelName,
            })),
          },
        };
      },
    },
    {
      title: '终点',
      dataIndex: 'target',
      key: 'target',
      editable: true,
      editorConfig: (record: StartData) => {
        return {
          inputType: EditType.SELECT,
          prop: {
            options: map(data.nodes, item => ({
              label: item.labelName,
              value: item.labelName,
            })),
          },
        };
      },
    },
    {
      title: '操作',
      dataIndex: 'operate',
      key: 'operate',
      render: (_, record) => (
        <Popconfirm
          title="确定要删除吗？"
          onConfirm={() => {
            updateState(draft => {
              draft.startList = [
                ...startList.filter(item => item.id !== record?.id),
              ];
            });
          }}
          okText="确定"
          cancelText="取消"
        >
          <a
            style={{
              color: 'rgba(54,55,64,1)',
              minWidth: 60,
              display: 'block',
            }}
          >
            删除
          </a>
        </Popconfirm>
      ),
    },
  ];

  const defaultColumns: EditColumnsType<AttrData> = [
    {
      title: (
        <>
          属性名称
          <Tooltip title="属性名称为属性列表唯一code">
            <QuestionCircleOutlined />
          </Tooltip>
        </>
      ),
      width: '38%',
      dataIndex: 'name',
      key: 'name',
      editable: true,
      editorConfig: (record: AttrData) => {
        return {
          inputType: EditType.INPUT,
          prop: { name: true },
        };
      },
    },
    {
      title: '数据类型',
      dataIndex: 'type',
      width: '25%',
      key: 'type',
      editable: true,
      editorConfig: (record: AttrData) => {
        return {
          inputType: EditType.SELECT,
          prop: { options: DATA_TYPE },
        };
      },
    },
    {
      title: '选填',
      dataIndex: 'optional',
      width: '25%',
      key: 'optional',
      editable: true,
      editorConfig: (record: AttrData) => {
        return {
          inputType: EditType.SELECT,
          prop: {
            defaultValue: false,
            disabled: isAllow(record),
            options: [
              {
                label: isAllow(record) ? '否（主键）' : '否',
                value: false,
              },
              { label: '是', value: true },
            ],
          },
        };
      },
    },
    {
      title: '操作',
      dataIndex: 'operate',
      key: 'operate',
      render: (_, record: any) => {
        return isAllow(record) ? (
          <Button
            disabled
            type="text"
            style={{
              color: 'rgba(54,55,64,1)',
              background: 'transparent',
              border: 'none',
            }}
          >
            -
          </Button>
        ) : (
          <Popconfirm
            title="确定要删除吗？"
            onConfirm={() => {
              updateState(draft => {
                draft.attrList = [
                  ...attrList.filter(item => item.id !== record?.id),
                ];
              });
            }}
            okText="确定"
            cancelText="取消"
          >
            <a
              style={{
                color: 'rgba(54,55,64,1)',
                minWidth: 60,
                display: 'block',
              }}
            >
              删除
            </a>
          </Popconfirm>
        );
      },
    },
  ];
  const nodeConfigColumns: EditColumnsType<IndexData> = [
    {
      title: '索引',
      width: '15%',
      dataIndex: 'index',
      key: 'index',
      editable: true,
      editorConfig: (record: IndexData) => {
        return {
          inputType: EditType.INPUT,
          prop: {
            disabled: true,
          },
        };
      },
    },
    {
      title: '属性',
      dataIndex: 'propertyName',
      width: '40%',
      key: 'propertyName',
      editable: true,
      editorConfig: (record: IndexData) => {
        return {
          inputType: EditType.SELECT,
          prop: {
            options: propertyList(),
          },
        };
      },
    },
    {
      title: '唯一',
      dataIndex: 'isUnique',
      width: '25%',
      key: 'isUnique',
      editable: true,
      editorConfig: (record: IndexData) => {
        if (!record.index) {
          record.isUnique = false;
        }
        return {
          inputType: EditType.SELECT,
          prop: {
            options: [
              { label: '否', value: false },
              { label: '是', value: true },
            ],
            ...(!record.index ? { disabled: true } : { disabled: false }),
          },
        };
      },
    },
    // {
    //   title: (
    //     <>
    //       主键
    //       <Tooltip title="主键必须是唯一索引">
    //         <QuestionCircleOutlined />
    //       </Tooltip>
    //     </>
    //   ),
    //   dataIndex: 'primaryField',
    //   width: '17.5%',
    //   key: 'primaryField',
    //   editable: true,
    //   editorConfig: (record: IndexData) => {
    //     return {
    //       inputType: EditType.SELECT,
    //       prop: {
    //         options: [
    //           { label: '否', value: false },
    //           { label: '是', value: true },
    //         ],
    //       },
    //     };
    //   },
    // },
    {
      title: '操作',
      dataIndex: 'operate',
      key: 'operate',
      render: (_, record: any) => (
        <Popconfirm
          title="确定要删除吗？"
          onConfirm={() => {
            updateState(draft => {
              draft.configList = [
                ...configList.filter(item => item.id !== record?.id),
              ];
            });
          }}
          okText="确定"
          cancelText="取消"
        >
          <a
            style={{
              color: 'rgba(54,55,64,1)',
              minWidth: 60,
              display: 'block',
            }}
          >
            删除
          </a>
        </Popconfirm>
      ),
    },
  ];
  const addNodeAttr = () => {
    updateState(draft => {
      const list = [...attrList];
      list.push({
        id: attrList.length + 1,
        name: '',
        type: '',
        optional: false,
      });
      draft.attrList = [...list];
    });
  };
  const addNodeConfig = () => {
    updateState(draft => {
      const list = [...configList];
      list.push({
        id: configList.length + 1,
        index: `#${configList.length + 1}`,
        isUnique: false,
        primaryField: '',
        propertyName: '',
      });
      draft.configList = [...list];
    });
  };
  const addEdge = () => {
    updateState(draft => {
      const list = [...startList];
      list.push({
        id: `${startList.length + 1}`,
        source: '',
        target: '',
      });
      draft.startList = [...list];
    });
  };
  return (
    <SwitchDrawer
      visible={visible}
      onShow={onShow}
      onClose={onClose}
      position="right"
      width={593}
      className={styles[`${PUBLIC_PERFIX_CLASS}-container`]}
      footer={
        <>
          <Button
            style={{ marginRight: 12 }}
            onClick={() => {
              onClose();
              form.resetFields();
              updateState(draft => {
                draft.startList = [];
                draft.configList = [];
                draft.attrList = [];
              });
            }}
          >
            取消
          </Button>
          <Button
            onClick={() => {
              const isEdgeRepeat =
                uniq(map(startList, item => `${item.source}_${item.target}`))
                  .length === startList.length;
              if (!isEdgeRepeat) {
                return message.error('两条边的起点和终点不能相同');
              }
              form.validateFields().then(() => {
                onFinish?.({
                  labelType: type,
                  labelName: form.getFieldValue('name'),
                  id: form.getFieldValue('name'),
                  type: 'graphin-circle',
                  style: {
                    label: { value: form.getFieldValue('name') },
                  },
                  indexs: configList,
                  properties: attrList,
                  edgeConstraints: map(startList, item => {
                    return [item.source, item.target];
                  }),
                });
                form.resetFields()
                onReset()
              });
            }}
          >
            完成
          </Button>
        </>
      }
    >
      <div className={styles[`${PUBLIC_PERFIX_CLASS}-container-content`]}>
        <div className={styles[`${PUBLIC_PERFIX_CLASS}-container-header`]}>
          <span> 添加{`${state.isNode ? '点' : '边'}`}类型</span>
          <div>
            <span style={{ marginRight: 4 }}>命令行建模</span>
            <a href="https://tugraph.antgroup.com/doc" target="_blank">
              参见文档
            </a>
          </div>
        </div>
        <div>
          <Form layout="vertical" form={form}>
            <Form.Item
              label={`${state.isNode ? '点' : '边'}类型名称`}
              name={'name'}
              rules={[
                {
                  required: true,
                  validator: (_props, value) => {
                    var reg = new RegExp('^[a-zA-Z0-9_\u4e00-\u9fa5]+$');
                    if (!value) {
                      return Promise.reject(
                        `请填写${state.isNode ? '点' : '边'}类型名称！`,
                      );
                    }
                    if (!reg.test(value)) {
                      return Promise.reject(
                        '名称由中文、字母、数字、下划线组成。',
                      );
                    } else {
                      return Promise.resolve();
                    }
                  },
                },
              ]}
            >
              <Input
                autoComplete="off"
                placeholder={`请输入${state.isNode ? '点' : '边'}类型名称`}
                className={styles[`${PUBLIC_PERFIX_CLASS}-container-name`]}
              />
            </Form.Item>
          </Form>
          <div className={styles[`${PUBLIC_PERFIX_CLASS}-container-attr`]}>
            <p className={styles[`${PUBLIC_PERFIX_CLASS}-container-title`]}>
              属性列表
            </p>
            <EditTable
              // className={styles[`${PUBLIC_PERFIX_CLASS}-container-attributes`]}
              // style={{ background: 'red' }}
              columns={defaultColumns}
              dataSource={attrList}
              rowKey="id"
              isNode={state?.isNode}
              onChange={newData => {
                updateState(draft => {
                  draft.attrList = [...(newData || [])];
                });
              }}
              bordered={true}
              pagination={false}
            />
            {addButton(addNodeAttr)}
          </div>
          {!state.isNode && (
            <div>
              <p className={styles[`${PUBLIC_PERFIX_CLASS}-container-title`]}>
                <Tooltip title="如果不选择，则表示起点和终点可以为任意点类型">
                  选择起点类型和终点类型 <QuestionCircleOutlined />
                </Tooltip>
              </p>
              <EditTable
                columns={colums}
                dataSource={startList}
                rowKey="id"
                bordered
                pagination={false}
                onChange={newData => {
                  updateState(draft => {
                    draft.startList = map([...newData], item => ({
                      ...item,
                      label: form.getFieldValue('name'),
                      style: { label: { value: form.getFieldValue('name') } },
                    }));
                  });
                }}
              />
              {addButton(addEdge, '添加起点和终点')}
            </div>
          )}
          {state.isNode && (
            <div>
              <p className={styles[`${PUBLIC_PERFIX_CLASS}-container-title`]}>
                索引列表
                <Tooltip title="只有选填为「否」的属性可以配置索引">
                  <QuestionCircleOutlined />
                </Tooltip>
              </p>
              <EditTable
                columns={nodeConfigColumns}
                dataSource={configList}
                rowKey="id"
                onChange={newData => {
                  updateState(draft => {
                    draft.configList = [...newData];
                  });
                }}
                bordered={true}
                pagination={false}
              />
              {addButton(addNodeConfig, '添加索引')}
            </div>
          )}
        </div>
      </div>
    </SwitchDrawer>
  );
};

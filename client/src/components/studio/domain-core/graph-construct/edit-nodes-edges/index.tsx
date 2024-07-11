import { PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, Popconfirm, Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { filter, find, map, uniqueId, xor } from 'lodash';
import React, { useEffect } from 'react';
import { useImmer } from 'use-immer';
import { EditTable } from '../../../components/edit-table';
import SwitchDrawer from '../../../components/switch-drawer';
import { DATA_TYPE, EditType, PUBLIC_PERFIX_CLASS } from '../../../constant';
import { useSchema } from '../../../hooks/useSchema';
import { useVisible } from '../../../hooks/useVisible';
import { AttrData, IndexData, StartData } from '../../../interface/schema';

import styles from './index.module.less';

type Prop = {
  type: 'node' | 'edge';
  data?: any;
  labelName: string;
  currentGraphName: string;
  onRefreshSchema?: () => void;
  onSwitch?: (onShow: () => void, onClose: () => void) => void;
  onVisible?: (visible: boolean) => void;
};
type EditColumnsType<T> = ColumnsType & {
  inputType?: string;
  prop: {
    options: Array<{ label: string; value: string }>;
    mode: 'multiple' | 'tags';
  };
};

export const EditNodesEdges: React.FC<Prop> = ({
  type,
  data = [],
  labelName,
  currentGraphName,
  onRefreshSchema,
  onSwitch,
  onVisible,
}) => {
  const [form] = Form.useForm();
  const {
    onDeleteLabelPropertySchema,
    onEditLabelPropertySchema,
    onCreateIndexSchema,
    onDeleteIndexSchema,
    onCreateLabelPropertySchema,
  } = useSchema();
  const { visible, onShow, onClose } = useVisible({ defaultVisible: true });
  const [state, updateState] = useImmer<{
    currentAttrList: Array<AttrData>;
    startList: Array<StartData>;
    attrList: Array<AttrData>;
    configList: Array<IndexData>;
  }>({
    startList: [],
    attrList: [],
    configList: [],
    currentAttrList: [],
  });
  const { startList, attrList, configList, currentAttrList } = state;
  const isNode = type === 'node';
  useEffect(() => {
    onSwitch?.(onShow, onClose);
  }, []);

  useEffect(() => {
    onVisible?.(visible);
  }, [visible]);

  const propertyList = () => {
    const attrPropertyNames = map(
      filter(attrList, attr => !attr.optional),
      item => item.name,
    );
    const indexPropertyNames = map(configList, item => item.propertyName);
   
    return map(
      filter(
        xor(attrPropertyNames, indexPropertyNames),
        item => item,
      ),
      item => ({ label: item, value: item }),
    );
  };
  const operateEdit = (record: AttrData) => {
    if (isPrimaryField(record.name)) {
      return (
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
      );
    }
    return (
      <>
        <Button
          disabled={isPrimaryField(record.name) || false}
          onClick={() => {
            updateState(draft => {
              draft.attrList = map(attrList, item => {
                if (record.id === item.id) {
                  return { ...item, disabled: false };
                }
                return { ...item };
              });
            });
          }}
          type="text"
        >
          编辑
        </Button>
        <Popconfirm
          disabled={isPrimaryField(record.name) || false}
          title="确定要删除吗？"
          onConfirm={() => {
            deleteProperty(record);
          }}
          okText="确定"
          cancelText="取消"
          okButtonProps={{ disabled: false }}
          cancelButtonProps={{ disabled: false }}
        >
          <Button disabled={isPrimaryField(record.name) || false} type="text">
            删除
          </Button>
        </Popconfirm>
      </>
    );
  };
  const operateCancel = (record: AttrData) => {
    return (
      <>
        <Button
          type="text"
          onClick={() => {
            if (record.disabled !== undefined) {
              editProperty(record);
            } else {
              createProperty(record);
            }
          }}
        >
          保存
        </Button>
        <Button
          onClick={() => {
            updateState(draft => {
              if (record.disabled !== undefined) {
                const list = map(attrList, item => {
                  if (item.id === record.id) {
                    return {
                      ...find(currentAttrList, attr => attr.id === record.id),
                    };
                  } else {
                    return item;
                  }
                });
                draft.attrList = list;
              } else {
                draft.attrList = [
                  ...filter(attrList, item => item.id !== record.id),
                ];
              }
            });
          }}
          type="text"
        >
          取消
        </Button>
      </>
    );
  };
  const indexOperateCancel = (record: IndexData) => {
    return (
      <div style={{ display: 'flex' }}>
        <Button
          type="text"
          onClick={() => {
            createIndex(record);
          }}
        >
          保存
        </Button>
        <Button
          onClick={() => {
            updateState(draft => {
              draft.configList = [
                ...configList.filter(item => item.id !== record?.id),
              ];
            });
          }}
          type="text"
        >
          取消
        </Button>
      </div>
    );
  };
  const indexOperateDelete = (record: IndexData) => {
    return (
      <Popconfirm
        disabled={isPrimaryField(record.propertyName) || false}
        title="确定要删除吗？"
        onConfirm={() => {
          deleteIndex(record);
        }}
        okText="确定"
        cancelText="取消"
        okButtonProps={{ disabled: false }}
        cancelButtonProps={{ disabled: false }}
      >
        <Button
          disabled={isPrimaryField(record.propertyName) || false}
          type="text"
        >
          删除
        </Button>
      </Popconfirm>
    );
  };
  const colums: EditColumnsType<any> = [
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
        <Button disabled type="text">
          删除
        </Button>
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
      width: '21%',
      dataIndex: 'name',
      key: 'name',
      editable: true,
      editorConfig: (record: AttrData) => {
        return {
          inputType: EditType.INPUT,
          prop: {
            disabled: record.disabled !== undefined,
          },
        };
      },
    },
    {
      title: '数据类型',
      dataIndex: 'type',
      width: '20%',
      key: 'type',
      editable: true,
      editorConfig: (record: AttrData) => {
        return {
          inputType: EditType.SELECT,
          prop: { options: DATA_TYPE, disabled: record.disabled !== undefined },
        };
      },
    },
    {
      title: '选填',
      dataIndex: 'optional',
      width: '20%',
      key: 'optional',
      editable: true,
      editorConfig: (record: AttrData) => {
        return {
          inputType: EditType.SELECT,
          prop: {
            disabled: record.disabled,
            defaultValue: false,
            options: [
              {
                label: isPrimaryField(record.name) ? '否（主键）' : '否',
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
      render: (_, record: any) =>
        !record.disabled ? operateCancel(record) : operateEdit(record),
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
            disabled: record.disabled,
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
              {
                label: record.primaryField ? '否（主键）' : '否',
                value: false,
              },
              { label: '是', value: true },
            ],
            disabled: record.disabled,
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
    //         disabled: record.disabled,
    //       },
    //     };
    //   },
    // },
    {
      title: '操作',
      dataIndex: 'operate',
      key: 'operate',
      render: (_, record: any) =>
        !record.disabled
          ? indexOperateCancel(record)
          : indexOperateDelete(record),
    },
  ];
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
  const findLabelItem = (labelName: string) => {
    return find(
      type === 'node' ? data.nodes : data.edges,
      item => item.labelName === labelName,
    );
  };
  const isPrimaryField = (name: string) => {
    return name === findLabelItem(labelName)?.primaryField;
  };
  const deleteProperty = (record: AttrData) => {
    onDeleteLabelPropertySchema({
      graphName: currentGraphName,
      labelName,
      labelType: type,
      propertyNames: [record.name],
    })
      .then(res => {
        if (res.success) {
          message.success('属性删除成功');
          updateState(draft => {
            draft.attrList = [
              ...attrList.filter(item => item.id !== record?.id),
            ];
          });
          onRefreshSchema?.();
        } else {
          message.error('属性删除失败' + res.errorMessage);
        }
      })
      .catch(res => {
        message.error('属性删除失败' + res.errorMessage);
      });
  };
  const editProperty = (record: AttrData) => {
    onEditLabelPropertySchema({
      graphName: currentGraphName,
      labelName,
      labelType: type,
      properties: [
        { name: record.name, type: record.type, optional: record.optional },
      ],
    })
      .then(res => {
        if (res.success) {
          message.success('属性修改成功');
          updateState(draft => {
            draft.attrList = [
              ...attrList.map(item => {
                if (item.id === record?.id) {
                  return { ...item, disabled: true };
                } else {
                  return item;
                }
              }),
            ];
          });
          onRefreshSchema?.();
        } else {
          message.error('属性修改失败' + res.errorMessage);
        }
      })
      .catch(res => {
        message.error('属性修改失败' + res.errorMessage);
      });
  };
  const createProperty = (record: AttrData) => {
    onCreateLabelPropertySchema({
      graphName: currentGraphName,
      labelName,
      labelType: type,
      properties: [
        { name: record.name, type: record.type, optional: record.optional },
      ],
    })
      .then(res => {
        if (res.success) {
          message.success('属性添加成功');
          updateState(draft => {
            draft.attrList = [
              ...attrList.map(item => {
                if (item.id === record?.id) {
                  return { ...item, disabled: true };
                } else {
                  return item;
                }
              }),
            ];
          });
          onRefreshSchema?.();
        } else {
          message.error('属性添加失败' + res.errorMessage);
        }
      })
      .catch(res => {
        message.error('属性添加失败' + res.errorMessage);
      });
  };
  const createIndex = (record: IndexData) => {
    onCreateIndexSchema({
      propertyName: record.propertyName,
      graphName: currentGraphName,
      labelName,
      isUnique: record.isUnique,
    })
      .then(res => {
        if (res.success) {
          message.success('索引添加成功');
          updateState(draft => {
            draft.configList = [
              ...configList.map(item => {
                if (item.id === record?.id) {
                  return { ...item, disabled: true };
                } else {
                  return item;
                }
              }),
            ];
          });
          onRefreshSchema?.();
        } else {
          message.error('索引添加失败' + res.errorMessage);
        }
      })
      .catch(res => {
        message.error('索引添加失败' + res.errorMessage);
      });
  };
  const deleteIndex = (record: IndexData) => {
    onDeleteIndexSchema({
      propertyName: record.propertyName,
      graphName: currentGraphName,
      labelName,
    })
      .then(res => {
        if (res.success) {
          message.success('索引删除成功');
          updateState(draft => {
            draft.configList = [
              ...configList.filter(item => item.id !== record?.id),
            ];
          });
          onRefreshSchema?.();
        } else {
          message.error('索引删除失败' + res.errorMessage);
        }
      })
      .catch(res => {
        message.error('索引删除失败' + res.errorMessage);
      });
  };
  const addNodeAttr = () => {
    updateState(draft => {
      const list = [...attrList];
      list.push({ id: uniqueId(`attr_`) });
      draft.attrList = [...list];
    });
  };
  const addNodeConfig = () => {
    updateState(draft => {
      const list = [...configList];
      list.push({ id: uniqueId(`index_`), index: `#${configList.length + 1}` });
      draft.configList = [...list];
    });
  };
  useEffect(() => {
    form.setFieldsValue({ name: labelName });
    updateState(draft => {
      const newAttrList = map(
        findLabelItem(labelName)?.properties,
        (item, index) => ({
          ...item,
          id: uniqueId(`attr_`),
          disabled: true,
        }),
      );
      draft.attrList = [...newAttrList];
      draft.currentAttrList = [...newAttrList];
      if (isNode) {
        draft.configList = map(
          findLabelItem(labelName)?.index,
          (item, index) => ({
            ...item,
            index: `#${index + 1}`,
            primaryField: isPrimaryField(item.propertyName),
            disabled: true,
            id: uniqueId(`index_`),
          }),
        );
      } else {
        draft.startList = [
          ...map(findLabelItem(labelName)?.edgeConstraints, item => ({
            source: item[0],
            target: item[1],
            id: uniqueId(`edge_`),
            disabled: true,
          })),
        ];
      }
    });
  }, [labelName]);
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
              const isAllSave = [...state.attrList].every(
                item => item.disabled,
              );
              if (isAllSave) {
                onClose();
              } else {
                const readyAttr = [...state.attrList].filter(
                  item => Object.keys(item).length > 1,
                );
                onEditLabelPropertySchema({
                  graphName: currentGraphName,
                  labelName,
                  labelType: type,
                  properties: readyAttr.map(item => ({
                    name: item.name,
                    type: item.type,
                    optional: item.optional,
                  })),
                })
                  .finally(() => {
                    updateState(preState => {
                      preState.attrList = readyAttr.map(item => ({
                        ...item,
                        disabled: true,
                      }));
                    });
                    onClose();
                  })
                  .catch(err => {
                    message.error(err);
                  });
              }
            }}
          >
            关闭
          </Button>
        </>
      }
    >
      <div className={styles[`${PUBLIC_PERFIX_CLASS}-container-content`]}>
        <div className={styles[`${PUBLIC_PERFIX_CLASS}-container-header`]}>
          <span> 编辑{`${isNode ? '点' : '边'}`}类型</span>
          <div>
            命令行建模
            <a href="https://tugraph.antgroup.com/doc" target="_blank">
              参见文档
            </a>
          </div>
        </div>
        <div>
          <Form layout="vertical" form={form}>
            <Form.Item
              label={`${isNode ? '点' : '边'}类型名称`}
              required
              name={'name'}
            >
              <Input
                disabled
                placeholder={`请输入${isNode ? '点' : '边'}类型名称`}
              />
            </Form.Item>
          </Form>
          <div className={styles[`${PUBLIC_PERFIX_CLASS}-container-attr`]}>
            <p className={styles[`${PUBLIC_PERFIX_CLASS}-container-title`]}>
              属性列表
            </p>
            <EditTable
              columns={defaultColumns}
              dataSource={attrList}
              rowKey="id"
              onChange={newData => {
                updateState(draft => {
                  draft.attrList = [...newData];
                });
              }}
              bordered={true}
              pagination={false}
            />
            {addButton(addNodeAttr)}
          </div>
          {!isNode && (
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
              />
            </div>
          )}
          {isNode && (
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

import {
  Button,
  Col,
  Form,
  Modal,
  Pagination,
  Row,
  Spin,
  Steps,
  message,
} from 'antd';
import { map } from 'lodash';
import React, { useEffect } from 'react';
import { useImmer } from 'use-immer';
import DemoCard from '../../../../../components/demo-card';
import { PUBLIC_PERFIX_CLASS, TUGRAPH_DEOM } from '../../../../../constant';
import { useGraph } from '../../../../../hooks/useGraph';

import EditForm from '../edit-form';

// utils
import { generateNameWithHash } from '@/utils/common';

import styles from './index.module.less';



type Props = { open: boolean; onClose: () => void };
const AddTuGraphModal: React.FC<Props> = ({ open, onClose }) => {
  const {
    onCreateGraph,
    createGraphLoading,
    onGetGraphList,
    onCreateDemoGraph,
  } = useGraph();
  
  const [form] = Form.useForm();
  const [state, setState] = useImmer<{
    current?: number;
    active?: number;
    loading: boolean;
  }>({
    current: 0,
    active: 0,
    loading: false,
  });
  useEffect(() => {
    setState(draft => {
      draft.active = 0;
      draft.current = 0;
    });
  }, [open]);
  const steps = [
    {
      title: '选择模版',
      content: 'First-content',
    },
    {
      title: '填写配置',
      content: 'Second-content',
    },
  ];
  const items = steps.map(item => ({ key: item.title, title: item.title }));
  const { current, active, loading } = state;
  const cardList = [
    {
      graph_demo_name: '空模版',
      graph_name: generateNameWithHash('空模版'),
      description: '自行定义点边模型和数据导入。',
      imgUrl:
        'https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*iLrCTZt0lAcAAAAAAAAAAAAADgOBAQ/original',
    },
    ...TUGRAPH_DEOM,
  ];

  const footer =
    current === 0 ? (
      <>
        <Button onClick={onClose}>取消</Button>
        <Button
          type="primary"
          onClick={() => {
            setState(draft => {
              draft.current = 1;
            });
            form.setFieldsValue({
              graphName: cardList[active || 0].graph_name,
              description: cardList[active || 0].description
            });
          }}
        >
          下一步
        </Button>
      </>
    ) : (
      <>
        <Button
          onClick={() => {
            setState(draft => {
              draft.current = 0;
            });
          }}
        >
          上一步
        </Button>
        <Button
          loading={createGraphLoading}
          type="primary"
          onClick={() => {
            form.validateFields().then(values => {
              const { graphName, description, maxSizeGB } = values;
              if (!active) {
                onCreateGraph({
                  graphName,
                  config: { description, maxSizeGB },
                })
                  .then((res) => {
                    if(res?.success){
                      message.success('新建成功');
                      onGetGraphList();
                      form.resetFields();
                      onClose();
                    } else {
                      message.error('创建失败' + res?.errorMessage);
                    }
                });
              } else {
                onCreateDemoGraph({
                  graphName,
                  config: { description, maxSizeGB },
                  path: cardList[active].path,
                })
                  .then(res => {
                    if (res?.success) {
                      message.success('模版创建成功');
                      onGetGraphList();
                      form.resetFields();
                      onClose();
                    } else {
                      message.error('模版创建失败' + res?.errorMessage);
                    }
                  })
                  .catch(e => {
                    message.error('模版创建失败' + e);
                    setState(draft => {
                      draft.loading = false;
                    });
                  });
              }
            });
          }}
        >
          创建
        </Button>
      </>
    );
  return (
    <Modal
      title="新建图"
      open={open}
      onCancel={onClose}
      style={{ top: 20 }}
      width={917}
      className={styles[`${PUBLIC_PERFIX_CLASS}-add-modal-container`]}
      footer={footer}
    >
      <Spin spinning={loading}>
        <div>
          <Steps current={current} items={items}>
            {map(items, item => (
              <Steps.Step title={item.title} key={item.title} />
            ))}
          </Steps>
          {current === 0 ? (
            <div className={styles[`${PUBLIC_PERFIX_CLASS}-stencil-container`]}>
              <Row
                gutter={16}
                className={
                  styles[`${PUBLIC_PERFIX_CLASS}-stencil-container-row`]
                }
              >
                {cardList.map((item, index) => (
                  <Col key={`col-${item.graph_demo_name}`}>
                    <DemoCard
                      key={item.graph_demo_name}
                      detail={item}
                      isActive={active === index}
                      onClick={() => {
                        setState(draft => {
                          draft.active = index;
                        });
                      }}
                    />
                  </Col>
                ))}
              </Row>
            </div>
          ) : (
            <div className={styles[`${PUBLIC_PERFIX_CLASS}-creat-step`]}>
              <EditForm form={form} />
            </div>
          )}
          {current === 0 && <Pagination size="small" total={cardList.length} />}
        </div>
      </Spin>
    </Modal>
  );
};
export default AddTuGraphModal;

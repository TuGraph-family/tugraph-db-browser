import { Button, Form, Modal, Pagination, Steps, message } from 'antd';
import React, { useEffect } from 'react';
import { useImmer } from 'use-immer';
import DemoCard from '../../../../../components/demo-card';
import { PUBLIC_PERFIX_CLASS, TUGRAPH_DEOM } from '../../../../../constant';
import { useGraph } from '../../../../../hooks/useGraph';
import { getLocalData } from '../../../../../utils';
import EditForm from '../edit-form';

import styles from './index.module.less';

type Props = { open: boolean; onClose: () => void };
const AddTuGraphModal: React.FC<Props> = ({ open, onClose }) => {
  const { onCreateGraph, createGraphLoading, onGetGraphList } = useGraph();
  const [form] = Form.useForm();
  const [state, setState] = useImmer<{ current?: number; active?: number }>({
    current: 0,
    active: 0,
  });
  useEffect(() => {
    setState((draft) => {
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
  const items = steps.map((item) => ({ key: item.title, title: item.title }));
  const { current, active } = state;
  const cardList = [
    {
      graph_name: '空模版',
      description:
        '这是一段模版描述这是一段模版描述这是一段模版描述这是一段，，，，',
      imgUrl:
        'https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*NuHMRpKzRWcAAAAAAAAAAAAADgOBAQ/original',
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
            setState((draft) => {
              draft.current = 1;
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
            setState((draft) => {
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
            form.validateFields().then((values) => {
              const { graphName, description, maxSizeGB } = values;
              onCreateGraph({
                graphName,
                config: { description, maxSizeGB },
              }).then((res) => {
                if (res.success) {
                  message.success('新建成功');
                  onGetGraphList({
                    userName: getLocalData('TUGRAPH_USER_NAME'),
                  });
                  form.resetFields();
                  onClose();
                }
              });
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
      visible={open}
      onCancel={onClose}
      width={917}
      className={styles[`${PUBLIC_PERFIX_CLASS}-add-modal-container`]}
      footer={footer}
    >
      <div>
        <Steps current={current} items={items} />
        {current === 0 ? (
          <div className={styles[`${PUBLIC_PERFIX_CLASS}-stencil-container`]}>
            {cardList.map((item, index) => (
              <DemoCard
                key={item.graph_name}
                detail={item}
                isActive={active === index}
                onClick={() => {
                  setState((draft) => {
                    draft.active = index;
                  });
                }}
              />
            ))}
          </div>
        ) : (
          <div className={styles[`${PUBLIC_PERFIX_CLASS}-creat-step`]}>
            <EditForm form={form} />
          </div>
        )}
        {current === 0 && <Pagination size="small" total={cardList.length} />}
      </div>
    </Modal>
  );
};
export default AddTuGraphModal;

import { Form, Modal, message } from 'antd';
import React, { useEffect } from 'react';
import { PUBLIC_PERFIX_CLASS } from '../../../../../constant';
import { useGraph } from '../../../../../hooks/useGraph';
import EditForm from '../edit-form';

import styles from './index.module.less';

type Prop = {
  open: boolean;
  onClose: () => void;
  detail: { graphName: string; description: string; maxSizeGB: number };
  onRefreshProjectList?: () => void;
};
const EditTuGraphMoadl: React.FC<Prop> = ({
  open,
  onClose,
  detail,
  onRefreshProjectList,
}) => {
  const [form] = Form.useForm();
  useEffect(() => {
    form.setFieldsValue({
      graphName: detail.graphName,
      description: detail.description,
      maxSizeGB: detail.maxSizeGB,
    });
  }, []);
  const { onEditGraph } = useGraph();
  return (
    <Modal
      visible={open}
      title="编辑图"
      onCancel={onClose}
      className={styles[`${PUBLIC_PERFIX_CLASS}-modal-container`]}
      onOk={() => {
        form.validateFields().then((values) => {
          const { graphName, description, maxSizeGB } = values;
          onEditGraph({ graphName, config: { description, maxSizeGB } }).then(
            (res) => {
              if (res.success) {
                message.success('修改成功');
                onRefreshProjectList?.();
                onClose();
              }
            }
          );
        });
      }}
      width={560}
      okText="确认"
      cancelText="取消"
    >
      <EditForm form={form} type="edit" />
    </Modal>
  );
};
export default EditTuGraphMoadl;

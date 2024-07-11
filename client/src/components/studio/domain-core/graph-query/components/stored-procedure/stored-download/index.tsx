import { Form, Modal, Radio, message } from 'antd';
import { map } from 'lodash';
import { useImmer } from 'use-immer';
import { PUBLIC_PERFIX_CLASS, STROED_TYPE } from '../../../../../constant';
import { useProcedure } from '../../../../../hooks/useProcedure';
import { downloadFile } from '../../../../../utils/downloadFile';

import styles from './index.module.less';

type Prop = {
  demoVisible: boolean;
  onCancel: () => void;
};
const { Item } = Form;
export const StoredDownLoad: React.FC<Prop> = ({ demoVisible, onCancel }) => {
  const [state, updateState] = useImmer<{ demoValue: string }>({
    demoValue: 'cpp_v1',
  });
  const { onGetProcedureDemo, GetProcedureDemoLoading } = useProcedure();
  const { demoValue } = state;
  const getDemo = (type: string) => {
    //TODO: By Allen
    onGetProcedureDemo({ type }).then((res) => {
      if (res.errorCode === '200') {
        downloadFile(atob(res.data.content), res.data.filename);
        message.success('下载成功');
      }
    });
  };

  return (
    <Modal
      title="Demo下载"
      width={525}
      visible={demoVisible}
      confirmLoading={GetProcedureDemoLoading}
      onOk={() => {
        getDemo(demoValue);
      }}
      onCancel={onCancel}
    >
      <Form layout="vertical">
        <Item
          label="存储过程类型"
          required
          className={styles[`${PUBLIC_PERFIX_CLASS}-form-radio`]}
        >
          <Radio.Group
            defaultValue={demoValue}
            onChange={(e) => {
              updateState((draft) => {
                draft.demoValue = e.target.value;
              });
            }}
          >
            {map(STROED_TYPE, (type) => (
              <Radio value={type.value} key={type.value}>
                {type.label}
              </Radio>
            ))}
          </Radio.Group>
        </Item>
      </Form>
    </Modal>
  );
};

import { cpp } from '@codemirror/lang-cpp';
import { java } from '@codemirror/lang-java';
import { python } from '@codemirror/lang-python';
import CodeMirror from '@uiw/react-codemirror';
import { Drawer } from 'antd';
import React from 'react';
type Prop = {
  visible: boolean;
  onClose: () => void;
  value: string;
};
export const StoredCheckoutDrawer: React.FC<Prop> = ({
  visible,
  onClose,
  value,
}) => {
  return (
    <Drawer
      width={570}
      placement="right"
      visible={visible}
      onClose={onClose}
      maskStyle={{ display: visible ? 'block' : 'none' }}
    >
      <CodeMirror
        readOnly
        value={value}
        extensions={[cpp(), python(), java()]}
      />
    </Drawer>
  );
};

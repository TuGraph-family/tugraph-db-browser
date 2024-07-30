import React from "react";
import { Button } from "antd";
import { PUBLIC_PERFIX_CLASS } from "@/components/studio/constant";

import styles from "./index.module.less";

interface EmptyProjectProps {
  onCreateProject: () => void;
}

const EmptyProject: React.FC<EmptyProjectProps> = ({ onCreateProject }) => {
  return (
    <div className={styles[`${PUBLIC_PERFIX_CLASS}-empty-project`]}>
      <img src="https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*nlUSRL-hZz0AAAAAAAAAAAAADgOBAQ/original" />
      <div className={styles[`${PUBLIC_PERFIX_CLASS}-desc`]}>
        你当前没有图项目，请先新建图项目
      </div>
      <div className={styles[`${PUBLIC_PERFIX_CLASS}-btn`]}>
        <Button type="primary" onClick={onCreateProject}>
          新建图项目
        </Button>
      </div>
    </div>
  );
};
export default EmptyProject;

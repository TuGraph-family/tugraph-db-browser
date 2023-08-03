import { Card } from 'antd';
import * as React from 'react';

interface TugraphDeployProps {
  context: any;
}

const Deploy: React.FunctionComponent<TugraphDeployProps> = props => {
  const { context } = props;
  const handleClick = async () => {
    // const res = await saveProject({
    //   workbookId: context.workbook.id,
    //   data: context,
    // });
    // if (res) {
    //   window.open(res.url);
    // }
  };

  return (
    <Card
      hoverable
      cover={
        <img
          src="https://gw-office.alipayobjects.com/bmw-prod/ab9749e4-1f56-42c3-a180-9245590e2a3e.png"
          onClick={handleClick}
        />
      }
    >
      <div className="card-meta">
        <div className="title">TuGraph 开放部署</div>
        <div>TuGraph-DB 团队提供的站点开放部署服务</div>
      </div>
    </Card>
  );
};

const TuGraph_DB = {
  desc: 'TuGraph-DB 部署',
  component: Deploy,
};

export { TuGraph_DB };

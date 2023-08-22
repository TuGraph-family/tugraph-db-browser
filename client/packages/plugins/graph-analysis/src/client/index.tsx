import { TableOutlined } from '@ant-design/icons';
import {
  SchemaComponentOptions,
  SchemaInitializer,
  SchemaInitializerContext,
} from '@tugraph/openpiece-client';
import React, { useContext } from 'react';
import TuGraphGraphAppConfig from './GI_EXPORT_FILES.json';
import { PluginDesigner } from './PluginDesigner';
//@ts-ignore
const { default: GI_SDK_APP } = window.GI_SDK_APP;

const GraphAnalysis = () => {
  const id = 'credit.json';
  // const url = `https://unpkg.alipay.com/@alipay/gi-assets-vip@latest/app/${id}`; // 内网 VIP 方案
  const service = async () => {
    // const config = await fetch(url).then(res => res.json());
    const config = TuGraphGraphAppConfig;
    return {
      data: config,
      success: true,
    };
  };
  return (
    <div
      style={{
        height: '100vh',
        backgroundImage:
          'var(--layout-background,radial-gradient(at 13% 5%, hsla(214, 100%, 37%, 0.29) 0px, transparent 50%), radial-gradient(at 100% 100%, hsla(254, 66%, 56%, 0.11) 0px, transparent 50%), radial-gradient(at 0% 100%, hsla(355, 100%, 93%, 0) 0px, transparent 50%), radial-gradient(at 61% 52%, hsla(227, 64%, 46%, 0.05) 0px, transparent 50%), radial-gradient(at 88% 12%, hsla(227, 70%, 49%, 0.1) 0px, transparent 50%), radial-gradient(at 100% 37%, hsla(254, 68%, 56%, 0) 0px, transparent 50%))',
      }}
    >
      <GI_SDK_APP id={id} service={service} />
    </div>
  );
};

export const PluginBlockInitializer = props => {
  const { insert } = props;

  const schema = {
    type: 'void',
    'x-component': 'CardItem',
    'x-designer': 'PluginDesigner',
    properties: {
      row1: {
        type: 'void',
        'x-component': 'GraphAnalysis',
        'x-async': false,
        'x-index': 1,
        'x-component-props': {},
      },
    },
  };

  return (
    <SchemaInitializer.Item
      {...props}
      icon={<TableOutlined />}
      onClick={() => {
        insert(schema);
      }}
      title="GraphAnalysis"
    />
  );
};

export default React.memo(props => {
  const items = useContext(SchemaInitializerContext) as any;
  const children = items?.BlockInitializers?.items?.[1]?.children ?? [];

  const hasCustomBlock = children?.find(d => d.key === ' GraphAnalysis');

  if (!hasCustomBlock) {
    children.push({
      key: ' GraphAnalysis',
      type: 'item',
      title: ' GraphAnalysis',
      component: PluginBlockInitializer,
    });
  }
  return (
    <SchemaComponentOptions
      components={{
        PluginDesigner,
        PluginBlockInitializer,
        GraphAnalysis,
      }}
    >
      <SchemaInitializerContext.Provider value={items}>
        {props.children}
      </SchemaInitializerContext.Provider>
    </SchemaComponentOptions>
  );
});

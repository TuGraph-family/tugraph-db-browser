import React, { useContext } from 'react';
import { TableOutlined } from '@ant-design/icons';
import {
  SchemaComponentOptions,
  SchemaInitializer,
  SchemaInitializerContext,
} from '@tugraph/openpiece-client';
import { PluginDesigner } from './PluginDesigner';

const GraphAnalysis = () => {
  return (
    <div>图分析</div>
  )
}

export const PluginBlockInitializer = (props) => {
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

export default React.memo((props) => {
  const items = useContext(SchemaInitializerContext) as any;
  const children = items?.BlockInitializers?.items?.[1]?.children ?? [];

  const hasCustomBlock = children?.find(
    (d) => d.key === ' GraphAnalysis'
  );

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

import React, { useContext } from 'react';
import { TableOutlined } from '@ant-design/icons';
import {
  SchemaComponentOptions,
  SchemaInitializer,
  SchemaInitializerContext,
} from '@tugraph/openpiece-client';
// @ts-ignore
import { GraphList } from '@@plugins/src/components/studio/tugraph';
import { PluginDesigner } from './PluginDesigner';

export const PluginBlockInitializer = (props) => {
  const { insert } = props;

  const schema = {
    type: 'void',
    'x-component': 'CardItem',
    'x-designer': 'PluginDesigner',
    properties: {
      row1: {
        type: 'void',
        'x-component': 'GraphList',
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
      title="GraphList"
    />
  );
};

export default React.memo((props) => {
  const items = useContext(SchemaInitializerContext);
  const children = items?.BlockInitializers?.items?.[1]?.children ?? [];

  const hasCustomBlock = children?.find(
    (d) => d.key === ' GraphList'
  );

  if (!hasCustomBlock) {
    children.push({
      key: ' GraphList',
      type: 'item',
      title: ' GraphList',
      component: PluginBlockInitializer,
    });
  }
  return (
    <SchemaComponentOptions
      components={{
        PluginDesigner,
        PluginBlockInitializer,
        GraphList,
      }}
    >
      <SchemaInitializerContext.Provider value={items}>
        {props.children}
      </SchemaInitializerContext.Provider>
    </SchemaComponentOptions>
  );
});

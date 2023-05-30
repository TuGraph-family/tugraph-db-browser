import React, { useContext } from 'react';
import { TableOutlined } from '@ant-design/icons';
import {
  SchemaComponentOptions,
  SchemaInitializer,
  SchemaInitializerContext,
} from '@tugraph/openpiece-client';
// @ts-ignore
import { UserCenter } from '@@plugins/src/components/console/tugraph';
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
        'x-component': 'UserCenter',
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
      title="UserCenter"
    />
  );
};

export default React.memo((props) => {
  const items = useContext(SchemaInitializerContext);
  const children = items?.BlockInitializers?.items?.[1]?.children ?? [];

  const hasCustomBlock = children?.find(
    (d) => d.key === ' UserCenter'
  );

  if (!hasCustomBlock) {
    children.push({
      key: ' UserCenter',
      type: 'item',
      title: ' UserCenter',
      component: PluginBlockInitializer,
    });
  }
  return (
    <SchemaComponentOptions
      components={{
        PluginDesigner,
        PluginBlockInitializer,
        UserCenter,
      }}
    >
      <SchemaInitializerContext.Provider value={items}>
        {props.children}
      </SchemaInitializerContext.Provider>
    </SchemaComponentOptions>
  );
});

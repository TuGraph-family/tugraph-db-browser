import { LAYOUT_FORM_CONFIG } from '@/domains-core/graph-analysis/graph-schema/constants/layout';
import { useSchemaGraphContext } from '@/domains-core/graph-analysis/graph-schema/contexts';
import {
  DefaultValue,
  LayoutFormConfig,
  LayoutFormItem,
} from '@/domains-core/graph-analysis/graph-schema/interfaces';
import { Form, Tooltip } from 'antd';
import { cloneDeep, debounce } from 'lodash';
import React, { useEffect } from 'react';
import { useImmer } from 'use-immer';
import styles from './index.less';

const defaultLayoutConfig: Record<string, DefaultValue> = {};

interface LayoutFormProps {
  value?: {
    layoutType?: string;
  };
}
const LayoutForm: React.FC<LayoutFormProps> = ({ value }) => {
  const [form] = Form.useForm();
  const { graph } = useSchemaGraphContext();

  const [state, setState] = useImmer<{
    currentLayout: LayoutFormConfig;
    layoutConfigMap: Record<string, LayoutFormConfig>;
    currentLayoutType: string;
    content: JSX.Element[];
    layoutTipInfo: {
      text: string;
      icon: any;
    };
  }>({
    currentLayout: LAYOUT_FORM_CONFIG.LAYOUT_FORCE,
    layoutConfigMap: LAYOUT_FORM_CONFIG,
    currentLayoutType: 'force',
    content: [],
    layoutTipInfo: {
      text: LAYOUT_FORM_CONFIG.LAYOUT_FORCE.title,
      icon: LAYOUT_FORM_CONFIG.LAYOUT_FORCE.icon,
    },
  });

  const {
    currentLayout,
    layoutConfigMap,
    currentLayoutType,
    content,
    layoutTipInfo,
  } = state;

  // 切换布局
  const handleToggleLayout = (value: string) => {
    const formatLayoutConfigMap = cloneDeep(layoutConfigMap);
    if (value) {
      const { nodes } = graph?.getData() || {};
      if (nodes) {
        // 初始化Panel的时候，添加clusterDagre的属性
        const attributes: Record<string, any> = {};
        nodes.forEach((n: any) => {
          attributes[n.label] = {};
          Object.keys(n.properties || {}).forEach(key => {
            attributes[n.label][key] = 'string';
          });
        });

        const nessesaryDataTypes = new Set(nodes.map((n: any) => n?.label));
        let attributeChoices = {};
        Object.keys(attributes).forEach(type => {
          if (nessesaryDataTypes.has(type)) {
            attributeChoices = { ...attributeChoices, ...attributes[type] };
          }
        });
        const attributeList = Object.entries(attributeChoices).map(([name]) => {
          return {
            label: name,
            value: name, // NOTE: 比较hack的方式，为了不引入大改动，把type放到value的字符串解析，避免给layout传类型相关信息
          };
        });
        const clusterPropertyName =
          formatLayoutConfigMap.LAYOUT_CLUSTER_DAGRE.items.find(
            item => item.label === 'clusterPropertyName',
          );

        if (clusterPropertyName) {
          clusterPropertyName.options = attributeList;
        }
      }
      setState(draft => {
        draft.currentLayoutType = value;
      });
    }
    const currentConfig = formatLayoutConfigMap[value];
    if (currentConfig) {
      setState(draft => {
        draft.currentLayout = currentConfig;
        draft.layoutTipInfo = {
          text: currentConfig.title,
          icon: currentConfig.icon,
        };
      });

      const currentContent = currentConfig.items.map(
        (item: LayoutFormItem, index: number) => {
          const {
            component: Component,
            isSwitch,
            defaultValue: value,
            labelZh,
            ...otherProps
          } = item;
          const key = `${currentConfig.title}-${index}`;
          defaultLayoutConfig[item.label] = item.defaultValue!;
          if (item.label === 'center' || item.label === 'begin') {
            const list = value as number[];
            if (item.defaultValue) {
              defaultLayoutConfig['x'] = list[0];
              defaultLayoutConfig['y'] = list[1];
            }
          }
          return (
            <Form.Item
              name={item.label}
              key={key}
              label={
                <Tooltip
                  title={
                    <span style={{ color: 'rgba(0, 0, 0, 0.85)' }}>
                      {item.description}
                    </span>
                  }
                  color="rgb(255 ,255 ,255)"
                >
                  <span>{labelZh}</span>
                </Tooltip>
              }
              valuePropName={isSwitch ? 'checked' : undefined}
            >
              {isSwitch ? (
                <Component defaultChecked={value} {...otherProps} key={key} />
              ) : (
                <Component {...otherProps} key={key} />
              )}
            </Form.Item>
          );
        },
      );
      form.setFieldsValue(defaultLayoutConfig);
      setState(draft => {
        draft.content = currentContent;
      });
    }
  };

  // 更新布局参数
  const updateLayoutConfig = (
    changedField: Record<string, any>,
    allFields: Record<string, DefaultValue>,
  ) => {
    const currentFileds = Object.assign({}, allFields, changedField);
    Object.keys(currentFileds).forEach(key => {
      defaultLayoutConfig[key] = currentFileds[key];
    });

    const { x, y, ...others } = currentFileds;
    const config = others;
    const { id, type } = currentLayout;
    if (id === 'Grid' || id === 'Dagre' || id === 'ClusteringDagre') {
      config.begin = [x, y];
    } else {
      config.center = [x, y];
    }
    if (!config.sweep) config.sweep = undefined;
    if (!config.nodeSize) config.nodeSize = undefined;
    graph?.setLayout({
      type,
      ...config,
    });

    form.setFieldsValue(defaultLayoutConfig);
    graph?.layout();
    graph?.fitCenter();
  };

  // 更新布局参数需要 debounce，使用 callback 来限流
  const debounceChange = debounce(
    (changedField, allFields) => updateLayoutConfig(changedField, allFields),
    currentLayoutType === 'gForce' ? 1000 : 500,
  );

  /**
   * 当字段值改变后，自动更新布局
   * @param changedFiled 改变了的字段
   * @param allFields 所有字段
   */
  const handleFieldValueChange = (
    changedField: Record<string, any>,
    allFields: Record<string, DefaultValue>,
  ) => {
    // 限流，防止频繁重新布局
    debounceChange(changedField, allFields);
  };

  useEffect(() => {
    if (value && value.layoutType) {
      handleToggleLayout(value.layoutType);
    }
  }, [value]);
  // 根据 Graph 的大小更新一遍默认系数
  useEffect(() => {
    if (graph) {
      const canvas = graph?.getCanvas();
      const [gWidth, gHeight] = canvas?.getSize();
      const gWidthHalf = gWidth / 2;
      const gHeightHalf = gHeight / 2;
      const resetLayoutConfig = Object.keys(layoutConfigMap).reduce(
        (map, key) => {
          const layoutConfig = layoutConfigMap[key];
          const newItems = layoutConfig.items.map((item: LayoutFormItem) => {
            switch (item.label) {
              case 'center':
                return {
                  ...item,
                  defaultValue: [gWidthHalf, gHeightHalf],
                };
              case 'width':
                return {
                  ...item,
                  defaultValue: gWidth,
                };
              case 'height':
                return {
                  ...item,
                  defaultValue: gHeight,
                };
              case 'radius':
                return {
                  ...item,
                  defaultValue: Math.max(
                    50,
                    Math.min(gHeightHalf - 50, gWidthHalf - 50),
                  ),
                };
              default:
                return item;
            }
          });
          map[key] = {
            ...layoutConfigMap[key],
            items: newItems,
          };
          return map;
        },
        {} as Record<string, LayoutFormConfig>,
      );

      setState(draft => {
        draft.layoutConfigMap = resetLayoutConfig;
      });
      form.setFieldsValue(defaultLayoutConfig);
    }
  }, []);

  return (
    <div className={styles['layoutContainer']}>
      <div style={{ fontWeight: 'bold', color: 'rgba(0, 0, 0, 0.85)' }}>
        {layoutTipInfo.text}
      </div>
      <div className={styles['contentContainer']}>
        <div className={styles['blockContainer']}>
          <Form
            form={form}
            name={`${currentLayoutType}-config-form`}
            initialValues={defaultLayoutConfig}
            onValuesChange={(changedField, allFields) => {
              handleFieldValueChange(changedField, allFields);
            }}
          >
            {content}
          </Form>
        </div>
      </div>
    </div>
  );
};

export default LayoutForm;

import IconFont from '@/components/icon-font';
import { tranformHexToRgb } from '@/utils';
import { Popover, Tooltip } from 'antd';
import React, { useEffect } from 'react';
import { ColorResult, SketchPicker } from 'react-color';
import { useImmer } from 'use-immer';
import styles from './index.less';

export interface CustomColorPickerProps {
  value?: any;
  defaultValue?: string;
  onChange?: (rgbaValue: string, originValue?: ColorResult) => void;
  trigger: 'icon' | 'box';
  style?: React.CSSProperties;
}

const CustomColorPicker: React.FC<CustomColorPickerProps> = ({
  onChange,
  value,
  defaultValue,
  trigger,
  style,
}) => {
  const [state, setState] = useImmer<{ color?: string }>({
    color: defaultValue || '#1890ff',
  });
  const { color } = state;
  useEffect(() => {
    setState((draft) => {
      draft.color = value || '#1890ff';
    });
  }, [value]);
  return (
    <div className={styles['color-input']} style={style}>
      <Popover
        trigger="click"
        overlayClassName={styles['geamaker-color-input-popover']}
        content={
          <SketchPicker
            color={color}
            onChangeComplete={(color) => {
              const { rgb } = color;
              const { r, g, b, a } = rgb;
              setState((draft) => {
                draft.color = `rgba(${r}, ${g}, ${b}, ${a})`;
              });

              if (onChange) {
                onChange(`rgba(${r}, ${g}, ${b}, ${a})`, color);
              }
            }}
          />
        }
      >
        {trigger === 'icon' ? (
          <Tooltip title="自定义颜色">
            <div
              className={[
                styles['color-picker-item'],
                styles['color-picker-item__ellipsis'],
              ].join(' ')}
            >
              <IconFont type="icon-ellipsis" />
            </div>
          </Tooltip>
        ) : (
          <div
            className={[
              styles['color-picker-item__active'],
              styles['color-picker-item'],
            ].join(' ')}
            style={{
              background: color,
              boxShadow: `${tranformHexToRgb(color, 0.3)}  0px 0px 0px 3px`,
              cursor: 'pointer',
            }}
          />
        )}
      </Popover>
    </div>
  );
};

export default CustomColorPicker;

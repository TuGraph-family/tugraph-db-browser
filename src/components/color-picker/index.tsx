import CustomColorPicker from '@/components/custom-color-picker';
import { tranformHexToRgb } from '@/utils/transformHexToRgb';
import React, { useCallback, useEffect, useMemo } from 'react';
import { Button, message, Tooltip } from 'antd';
import copy from 'copy-to-clipboard';
import { useImmer } from 'use-immer';
import { DEFAULT_NODE_ACTIVE_COLOR } from './constant';
import styles from './index.less';

const DEFAULT_ELEMENT_COLORS = [
  '#1890ff',
  '#87e8de',
  '#52c41a',
  '#722ed1',
  '#eb2f96',
  '#faad14',
  '#13c2c2',
  '#2f54eb',
];

interface ColorPickerProps {
  value?: string;
  onChange?: (color: string) => void;
  maxLength?: number;
  disabled?: boolean;
  style?: React.CSSProperties;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  value,
  onChange,
  maxLength,
  disabled,
  style,
}) => {
  const [state, setState] = useImmer<{ activeColor: string }>({
    activeColor: value || DEFAULT_NODE_ACTIVE_COLOR,
  });
  const { activeColor } = state;
  const displayColors = useMemo(
    () => DEFAULT_ELEMENT_COLORS.slice(0, maxLength),
    [maxLength],
  );

  const onColorChange = useCallback(
    (color: string) => {
      if (disabled) {
        return;
      }
      setState((draft) => {
        draft.activeColor = color;
      });
      if (onChange) {
        onChange(color);
      }
    },
    [disabled, onChange],
  );
  const renderColorItem = useCallback(
    (color: string) => {
      return (
        <Tooltip
          color="#fff"
          key={color}
          title={
            <Button
              type="link"
              onClick={() => {
                copy(color);
                message.success('复制成功!');
              }}
            >
              复制颜色
            </Button>
          }
        >
          <div
            className={styles['color-picker-item']}
            key={color}
            style={{
              background: color,
            }}
            onClick={() => onColorChange(color)}
          />
        </Tooltip>
      );
    },
    [onColorChange],
  );
  useEffect(() => {
    if (value) {
      setState((draft) => {
        draft.activeColor = value;
      });
    }
  }, [value]);

  return (
    <div className={styles['color-picker']} style={style}>
      <Tooltip title="当前颜色">
        <div
          className={[
            styles['color-picker-item__active'],
            styles['color-picker-item'],
          ].join(' ')}
          style={{
            background: activeColor,
            boxShadow: `${tranformHexToRgb(activeColor, 0.3)}  0px 0px 0px 3px`,
            cursor: 'default',
          }}
        />
      </Tooltip>
      {displayColors.map((color) => renderColorItem(color))}
      {typeof maxLength === 'number' &&
        maxLength < DEFAULT_ELEMENT_COLORS.length && (
          <CustomColorPicker
            trigger="icon"
            onChange={(rgbColor, color) => onColorChange(color?.hex || '')}
            value={activeColor}
          />
        )}
    </div>
  );
};

export default ColorPicker;

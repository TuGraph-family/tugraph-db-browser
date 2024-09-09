import { DEFAULT_NODE_ACTIVE_COLOR } from '@/components/color-picker/constant';
import IconFont from '@/components/icon-font';
import { fontFamily, iconLoader } from '@/components/icon-loader';
import { tranformHexToRgb } from '@/utils/transformHexToRgb';
import React, { useCallback, useEffect, useMemo } from 'react';
import {
  Button,
  message,
  Popover,
  Radio,
  RadioChangeEvent,
  Tooltip,
} from 'antd';
import copy from 'copy-to-clipboard';
import { useImmer } from 'use-immer';

import {
  DEFAULT_ICON_OPTIONS,
  IconLibraryClass,
  ICON_LIBRARY,
  ICON_LIBRARY_OPTIONS,
} from './constant';
import styles from './index.less';

interface IconPickerValueType {
  fontFamily: string;
  class: string;
  name: string;
  text: string;
  value: string;
}

interface IconPickerProps {
  value?: IconPickerValueType;
  onChange?: (value: IconPickerValueType) => void;
  color?: string;
  disabled?: boolean;
  maxLength?: number;
}

const IconPicker: React.FC<IconPickerProps> = (props) => {
  const { value, onChange, color, disabled, maxLength = 5 } = props;
  const [state, setState] = useImmer<{
    iconFontClass: IconLibraryClass;
    activeIcon?: string;
  }>({
    iconFontClass: 'default',
  });
  const { iconFontClass, activeIcon } = state;
  const activeIconList = useMemo(
    () => ICON_LIBRARY[iconFontClass].list,
    [iconFontClass],
  );
  const activeColor = useMemo(
    () => color || DEFAULT_NODE_ACTIVE_COLOR,
    [color],
  );
  const onIconClassChange = (e: RadioChangeEvent) => {
    setState((draft) => {
      draft.iconFontClass = e.target.value;
    });
  };
  const onIconChange = (name: string) => {
    if (disabled) {
      return;
    }
    setState((draft) => {
      draft.activeIcon = `nodeIcon-${name.replace(' ', '')}`;
    });
    if (onChange) {
      onChange({
        fontFamily,
        class: iconFontClass,
        name,
        text: iconLoader[name],
        value: iconLoader[name],
      });
    }
  };
  const copyIconName = useCallback((name: string) => {
    copy(name);
    message.success('复制成功!');
  }, []);
  const renderTooltipTitle = useCallback((name: string) => {
    return (
      <Button type="link" onClick={() => copyIconName(name)}>
        复制图标
      </Button>
    );
  }, []);
  const displayIcons = useMemo(
    () => DEFAULT_ICON_OPTIONS.slice(0, maxLength),
    [maxLength],
  );
  useEffect(() => {
    if (value && value.class) {
      setState((draft) => {
        draft.iconFontClass = value.class as IconLibraryClass;
        draft.activeIcon = `nodeIcon-${value.name.replace(' ', '')}`;
      });
    } else {
      setState((draft) => {
        draft.iconFontClass = 'default';
        draft.activeIcon = undefined;
      });
    }
  }, [value]);

  return (
    <div className={styles['icon-picker']}>
      <div
        className={[
          styles['icon-picker-item'],
          styles['icon-picker-item__active'],
        ].join(' ')}
        style={{
          background: tranformHexToRgb(activeColor, 0.3),
          fontSize: 14,
          color: activeColor,
        }}
      >
        {activeIcon && <IconFont type={activeIcon} />}
      </div>
      {displayIcons.map((icon) => {
        const { value, key } = icon;
        return (
          <div
            className={styles['icon-picker-item']}
            key={value}
            onClick={() => onIconChange(key)}
          >
            <Tooltip color="#FFF" title={renderTooltipTitle(key)}>
              <IconFont type={value} />
            </Tooltip>
          </div>
        );
      })}

      <Popover
        placement="bottom"
        content={
          <div className={styles['icon-picker-item-popover']}>
            <Radio.Group
              options={ICON_LIBRARY_OPTIONS}
              onChange={onIconClassChange}
              value={iconFontClass}
            />
            <div className={styles['popover-content']}>
              {activeIconList.map((icon) => (
                <div
                  className={styles['popover-content-item']}
                  key={icon.value}
                  onClick={() => onIconChange(icon.key)}
                >
                  <Tooltip color="#FFF" title={renderTooltipTitle(icon.key)}>
                    <IconFont type={icon.value} />
                  </Tooltip>
                </div>
              ))}
            </div>
          </div>
        }
      >
        <div className={styles['icon-picker-item']}>
          <IconFont type="icon-ellipsis" />
        </div>
      </Popover>
    </div>
  );
};

export default IconPicker;

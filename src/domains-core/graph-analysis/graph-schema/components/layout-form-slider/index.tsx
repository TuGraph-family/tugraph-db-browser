import { Slider } from 'antd';
import React from 'react';
import { DEFAULT_MARKS } from '@/domains-core/graph-analysis/graph-schema/constants/layout';

interface LayoutFormSliderProps {
  onChange?: (value: number) => void;
  defaultValue?: number;
  value?: number;
  marks?: Record<number, string>;
  min?: number;
  max?: number;
}

const LayoutFormSlider: React.FC<LayoutFormSliderProps> = ({
  marks = DEFAULT_MARKS,
  min = 5,
  max = 100,
  ...others
}) => {
  return <Slider min={min} max={max} marks={marks} {...others} />;
};

export default LayoutFormSlider;

import { AriaProgressBarProps, useProgressBar } from '@react-aria/progress';
import { mergeProps } from '@react-aria/utils';
import { HTMLAttributes } from 'react';

import { Fill, Mask } from './ProgressCircle.style';

type Props = { diameter?: number | string; thickness: number };

type InheritAttrs = Omit<AriaProgressBarProps, keyof Props>;

type NativeAttrs = Omit<HTMLAttributes<unknown>, keyof InheritAttrs & keyof Props>;

type ProgressCircleProps = Props & InheritAttrs & NativeAttrs;

const viewBoxDiameter = 32;
const center = viewBoxDiameter / 2;
const viewBox = `0 0 ${viewBoxDiameter} ${viewBoxDiameter}`;

// TODO: move LoadingSpinner indeterminate over here
const ProgressCircle = (props: ProgressCircleProps): JSX.Element => {
  const { value = 0, minValue = 0, maxValue = 100, diameter = '1.5em', thickness = 3 } = props;
  const { progressBarProps } = useProgressBar(props);

  const r = center - thickness;
  const c = 2 * r * Math.PI;
  const percentage = (value - minValue) / (maxValue - minValue);
  const offset = c - percentage * c;

  return (
    <svg
      {...mergeProps(progressBarProps, props)}
      width={diameter}
      height={diameter}
      viewBox={viewBox}
      strokeWidth={thickness}
      fill='none'
    >
      <Mask role='presentation' cx={center} cy={center} r={r} />
      <Fill
        role='presentation'
        cx={center}
        cy={center}
        r={r}
        strokeDasharray={`${c} ${c}`}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${center} ${center})`}
      />
    </svg>
  );
};

export { ProgressCircle };
export type { ProgressCircleProps };

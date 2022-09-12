import { HTMLAttributes } from 'react';

import { Variants } from '../utils/prop-types';
import { BaseIndeterminateLoadingSpinner, BaseLoadingSpinner, BaseLoadingSpinnerProps } from './LoadingSpinner.style';

type SpinnerVariants = 'indeterminate' | 'determinate';

type Props = {
  variant?: SpinnerVariants;
  diameter?: number;
  thickness?: number;
  color?: Variants;
};

type NativeAttrs = Omit<HTMLAttributes<unknown>, keyof Props>;

type LoadingSpinnerProps = Props & NativeAttrs;

const LoadingSpinner = ({
  diameter = 48,
  thickness = 10,
  variant = 'determinate',
  color = 'primary',
  ...props
}: LoadingSpinnerProps): JSX.Element => {
  const commonProps: LoadingSpinnerProps & BaseLoadingSpinnerProps = {
    role: 'progressbar',
    $diameter: diameter,
    $thickness: thickness,
    $color: color,
    ...props
  };

  if (variant === 'indeterminate') {
    return <BaseIndeterminateLoadingSpinner {...commonProps} />;
  }

  return <BaseLoadingSpinner {...commonProps} />;
};

export { LoadingSpinner };
export type { LoadingSpinnerProps, SpinnerVariants };

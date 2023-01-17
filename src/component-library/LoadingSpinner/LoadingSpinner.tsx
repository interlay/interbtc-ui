import { HTMLAttributes } from 'react';

import { Colors, IconSize } from '../utils/prop-types';
import { StyledLoadingSpinner } from './LoadingSpinner.style';

type Props = {
  thickness?: number;
  color?: Colors;
  size?: IconSize;
};

type NativeAttrs = Omit<HTMLAttributes<unknown>, keyof Props>;

type LoadingSpinnerProps = Props & NativeAttrs;

const LoadingSpinner = ({
  thickness = 3,
  color = 'primary',
  size = 'md',
  ...props
}: LoadingSpinnerProps): JSX.Element => {
  return <StyledLoadingSpinner role='progressbar' $thickness={thickness} $color={color} $size={size} {...props} />;
};

export { LoadingSpinner };
export type { LoadingSpinnerProps };

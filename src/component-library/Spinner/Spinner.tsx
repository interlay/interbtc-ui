import { forwardRef, SVGAttributes } from 'react';

import { IconSize } from '../utils/prop-types';
import { StyledSpinner } from './Spinner.style';

type Variants = 'primary' | 'secondary' | 'outlined' | 'text';

type Props = {
  size?: IconSize;
  variant?: Variants;
};

type NativeAttrs<T = unknown> = Omit<SVGAttributes<T>, keyof Props>;

type SpinnerProps<T = unknown> = Props & NativeAttrs<T>;

const Spinner = forwardRef<SVGSVGElement, SpinnerProps>(
  ({ size = 'md', variant = 'primary', ...props }, ref): JSX.Element => (
    <StyledSpinner ref={ref} $variant={variant} $size={size} {...props} />
  )
);

Spinner.displayName = 'Spinner';

export { Spinner };
export type { SpinnerProps };

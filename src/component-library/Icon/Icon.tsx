import { forwardRef, SVGAttributes } from 'react';

import { Colors, IconSize } from '../utils/prop-types';
import { StyledIcon } from './Icon.style';

type Props = {
  size?: IconSize;
  color?: Colors;
};

type NativeAttrs<T = unknown> = Omit<SVGAttributes<T>, keyof Props>;

type IconProps<T = unknown> = Props & NativeAttrs<T>;

const Icon = forwardRef<SVGSVGElement, IconProps>(
  ({ size = 'md', color = 'primary', ...props }, ref): JSX.Element => (
    <StyledIcon ref={ref} $color={color} $size={size} {...props} />
  )
);

Icon.displayName = 'Icon';

export { Icon };
export type { IconProps };

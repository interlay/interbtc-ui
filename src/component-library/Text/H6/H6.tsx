import { forwardRef } from 'react';

import { Text } from '../style';
import { TextProps } from '../types';
import { mapTextProps } from '../utils';

type H6Props = TextProps<HTMLHeadingElement>;

const H6 = forwardRef<HTMLHeadingElement, H6Props>(
  ({ size = 'lg', ...props }, ref): JSX.Element => <Text ref={ref} as='h6' {...mapTextProps({ size, ...props })} />
);

H6.displayName = 'H6';

export { H6 };
export type { H6Props };

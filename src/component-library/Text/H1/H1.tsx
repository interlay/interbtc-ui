import { forwardRef } from 'react';

import { Text } from '../style';
import { TextProps } from '../types';
import { mapTextProps } from '../utils';

type H1Props = TextProps<HTMLHeadingElement>;

const H1 = forwardRef<HTMLHeadingElement, H1Props>(
  ({ size = 'xl5', ...props }, ref): JSX.Element => <Text ref={ref} as='h1' {...mapTextProps({ size, ...props })} />
);

H1.displayName = 'H1';

export { H1 };
export type { H1Props };

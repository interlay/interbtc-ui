import { forwardRef } from 'react';

import { Text } from '../style';
import { TextProps } from '../types';
import { mapTextProps } from '../utils';

type H2Props = TextProps<HTMLHeadingElement>;

const H2 = forwardRef<HTMLHeadingElement, H2Props>(
  ({ size = 'xl4', ...props }, ref): JSX.Element => <Text ref={ref} as='h2' {...mapTextProps({ size, ...props })} />
);

H2.displayName = 'H2';

export { H2 };
export type { H2Props };

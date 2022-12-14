import { forwardRef } from 'react';

import { Text } from '../style';
import { TextProps } from '../types';
import { mapTextProps } from '../utils';

type H3Props = TextProps<HTMLHeadingElement>;

const H3 = forwardRef<HTMLHeadingElement, H3Props>(
  ({ size = 'xl3', ...props }, ref): JSX.Element => <Text ref={ref} as='h3' {...mapTextProps({ size, ...props })} />
);

H3.displayName = 'H3';

export { H3 };
export type { H3Props };

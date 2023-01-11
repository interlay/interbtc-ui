import { forwardRef } from 'react';

import { Text } from '../style';
import { TextProps } from '../types';
import { mapTextProps } from '../utils';

type H5Props = TextProps<HTMLHeadingElement>;

const H5 = forwardRef<HTMLHeadingElement, H5Props>(
  ({ size = 'xl', ...props }, ref): JSX.Element => <Text ref={ref} as='h5' {...mapTextProps({ size, ...props })} />
);

H5.displayName = 'H5';

export { H5 };
export type { H5Props };

import { forwardRef } from 'react';

import { Text } from '../style';
import { TextProps } from '../types';
import { mapTextProps } from '../utils';

type DtProps = TextProps<HTMLElement>;

const Dt = forwardRef<HTMLElement, DtProps>(
  ({ color = 'tertiary', ...props }, ref): JSX.Element => (
    <Text ref={ref} as='dt' {...mapTextProps({ color, ...props })} />
  )
);

Dt.displayName = 'Dt';

export { Dt };
export type { DtProps };

import { forwardRef } from 'react';

import { Text } from '../style';
import { TextProps } from '../types';
import { mapTextProps } from '../utils';

type StrongProps = TextProps<HTMLElement>;

const Strong = forwardRef<HTMLElement, StrongProps>(
  (props, ref): JSX.Element => <Text ref={ref} as='strong' {...mapTextProps(props)} />
);

Strong.displayName = 'Strong';

export { Strong };
export type { StrongProps };

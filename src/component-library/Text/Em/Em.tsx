import { forwardRef } from 'react';

import { Text } from '../style';
import { TextProps } from '../types';
import { mapTextProps } from '../utils';

type EmProps = TextProps<HTMLElement>;

const Em = forwardRef<HTMLElement, EmProps>(
  (props, ref): JSX.Element => <Text ref={ref} as='em' {...mapTextProps(props)} />
);

Em.displayName = 'Em';

export { Em };
export type { EmProps };

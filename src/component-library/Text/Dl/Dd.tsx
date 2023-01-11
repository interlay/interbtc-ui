import { forwardRef } from 'react';

import { Text } from '../style';
import { TextProps } from '../types';
import { mapTextProps } from '../utils';

type DdProps = TextProps<HTMLElement>;

const Dd = forwardRef<HTMLElement, DdProps>(
  (props, ref): JSX.Element => <Text ref={ref} as='dd' {...mapTextProps(props)} />
);

Dd.displayName = 'Dd';

export { Dd };
export type { DdProps };

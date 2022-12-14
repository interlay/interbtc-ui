import { forwardRef } from 'react';

import { Text } from '../style';
import { TextProps } from '../types';
import { mapTextProps } from '../utils';

type PProps = TextProps<HTMLParagraphElement>;

const P = forwardRef<HTMLParagraphElement, PProps>(
  (props, ref): JSX.Element => <Text ref={ref} as='p' {...mapTextProps(props)} />
);

P.displayName = 'P';

export { P };
export type { PProps };

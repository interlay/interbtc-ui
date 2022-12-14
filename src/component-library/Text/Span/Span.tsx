import { forwardRef } from 'react';

import { Text } from '../style';
import { TextProps } from '../types';

type SpanProps = TextProps<HTMLSpanElement>;

const Span = forwardRef<HTMLSpanElement, SpanProps>(
  (props, ref): JSX.Element => <Text ref={ref} as='span' {...mapTextProps(props)} />
);

Span.displayName = 'Span';

export { Span };
export type { SpanProps };

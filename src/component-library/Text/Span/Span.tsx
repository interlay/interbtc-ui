import { forwardRef } from 'react';

import { TextProps } from '../types';
import { SpanText } from './Span.style';

const Span = forwardRef<HTMLElement, TextProps<HTMLElement>>(
  ({ color, children, ...props }, ref): JSX.Element => (
    <SpanText ref={ref} color={color} {...props}>
      {children}
    </SpanText>
  )
);

Span.displayName = 'Span';

export { Span };

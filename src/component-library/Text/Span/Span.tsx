import { forwardRef } from 'react';

import { Text } from '../style';
import { TextProps } from '../types';

const Span = forwardRef<HTMLSpanElement, TextProps<HTMLSpanElement>>(
  ({ color, size, children, ...props }, ref): JSX.Element => (
    <Text ref={ref} as='span' $color={color} $size={size} {...props}>
      {children}
    </Text>
  )
);

Span.displayName = 'Span';

export { Span };

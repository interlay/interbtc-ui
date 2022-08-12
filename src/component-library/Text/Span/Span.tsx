import { TextProps } from '../types';
import { SpanText } from './Span.style';

const Span = ({ color, children, ...props }: TextProps<HTMLElement>): JSX.Element => (
  <SpanText color={color} {...props}>
    {children}
  </SpanText>
);

Span.displayName = 'Span';

export { Span };

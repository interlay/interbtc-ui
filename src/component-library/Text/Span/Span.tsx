import { Text } from '../style';
import { TextProps } from '../types';

const Span = ({ color, size, children, ...props }: TextProps<HTMLSpanElement>): JSX.Element => (
  <Text as='span' $color={color} $size={size} {...props}>
    {children}
  </Text>
);

Span.displayName = 'Span';

export { Span };

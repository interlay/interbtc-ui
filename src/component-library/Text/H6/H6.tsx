import { Text } from '../style';
import { TextProps } from '../types';

const H6 = ({ color, size = 'lg', children, ...props }: TextProps<HTMLHeadingElement>): JSX.Element => (
  <Text as='h6' $color={color} $size={size} {...props}>
    {children}
  </Text>
);

H6.displayName = 'H6';

export { H6 };

import { Text } from '../style';
import { TextProps } from '../types';

const H3 = ({ color, size = '3xl', children, ...props }: TextProps<HTMLHeadingElement>): JSX.Element => (
  <Text as='h3' $color={color} $size={size} {...props}>
    {children}
  </Text>
);

H3.displayName = 'H3';

export { H3 };

import { Text } from '../style';
import { TextProps } from '../types';

const H2 = ({ color, size = '4xl', children, ...props }: TextProps<HTMLHeadingElement>): JSX.Element => (
  <Text as='h2' $color={color} $size={size} {...props}>
    {children}
  </Text>
);

H2.displayName = 'H2';

export { H2 };

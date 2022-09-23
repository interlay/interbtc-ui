import { Text } from '../style';
import { TextProps } from '../types';

const H1 = ({ color, size = '5xl', children, ...props }: TextProps<HTMLHeadingElement>): JSX.Element => (
  <Text as='h1' $color={color} $size={size} {...props}>
    {children}
  </Text>
);

H1.displayName = 'H1';

export { H1 };

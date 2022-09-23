import { Text } from '../style';
import { TextProps } from '../types';

const H4 = ({ color, size = '2xl', children, ...props }: TextProps<HTMLHeadingElement>): JSX.Element => (
  <Text as='h4' $color={color} $size={size} {...props}>
    {children}
  </Text>
);

H4.displayName = 'H4';

export { H4 };

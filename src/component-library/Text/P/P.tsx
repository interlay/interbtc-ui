import { Text } from '../style';
import { TextProps } from '../types';

const P = ({ color, size, children, ...props }: TextProps<HTMLHeadingElement>): JSX.Element => (
  <Text as='p' $color={color} $size={size} {...props}>
    {children}
  </Text>
);

P.displayName = 'P';

export { P };

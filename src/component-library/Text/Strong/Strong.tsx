import { Text } from '../style';
import { TextProps } from '../types';

const Strong = ({ color, size, children, ...props }: TextProps<HTMLHeadingElement>): JSX.Element => (
  <Text as='strong' $color={color} $size={size} {...props}>
    {children}
  </Text>
);

Strong.displayName = 'Strong';

export { Strong };

import { Text } from '../style';
import { TextProps } from '../types';

const Em = ({ color, size, children, ...props }: TextProps<HTMLElement>): JSX.Element => (
  <Text as='em' $color={color} $size={size} {...props}>
    {children}
  </Text>
);

Em.displayName = 'Em';

export { Em };

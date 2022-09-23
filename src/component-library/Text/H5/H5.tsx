import { Text } from '../style';
import { TextProps } from '../types';

const H5 = ({ color, size = 'xl', children, ...props }: TextProps<HTMLHeadingElement>): JSX.Element => (
  <Text as='h5' $color={color} $size={size} {...props}>
    {children}
  </Text>
);

H5.displayName = 'H5';

export { H5 };

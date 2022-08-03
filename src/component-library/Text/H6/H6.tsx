import { TextProps } from '../types';
import { H6Text } from './H6.style';

const H6 = ({ color, children, ...props }: TextProps<HTMLHeadingElement>): JSX.Element => (
  <H6Text color={color} {...props}>
    {children}
  </H6Text>
);

H6.displayName = 'H6';

export { H6 };

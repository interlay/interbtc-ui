import { TextProps } from '../types';
import { H2Text } from './H2.style';

const H2 = ({ color, children, ...props }: TextProps<HTMLHeadingElement>): JSX.Element => (
  <H2Text color={color} {...props}>
    {children}
  </H2Text>
);

H2.displayName = 'H2';

export { H2 };

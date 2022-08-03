import { TextProps } from '../types';
import { H1Text } from './H1.style';

const H1 = ({ color, children, ...props }: TextProps<HTMLHeadingElement>): JSX.Element => (
  <H1Text color={color} {...props}>
    {children}
  </H1Text>
);

H1.displayName = 'H1';

export { H1 };

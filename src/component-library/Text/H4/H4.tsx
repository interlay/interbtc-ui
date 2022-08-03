import { TextProps } from '../types';
import { H4Text } from './H4.style';

const H4 = ({ color, children, ...props }: TextProps<HTMLHeadingElement>): JSX.Element => (
  <H4Text color={color} {...props}>
    {children}
  </H4Text>
);

H4.displayName = 'H4';

export { H4 };

import { TextProps } from '../types';
import { H3Text } from './H3.style';

const H3 = ({ color, children, ...props }: TextProps<HTMLHeadingElement>): JSX.Element => (
  <H3Text color={color} {...props}>
    {children}
  </H3Text>
);

H3.displayName = 'H3';

export { H3 };

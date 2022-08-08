import { TextProps } from '../types';
import { H5Text } from './H5.style';

const H5 = ({ color, children, ...props }: TextProps<HTMLHeadingElement>): JSX.Element => (
  <H5Text color={color} {...props}>
    {children}
  </H5Text>
);

H5.displayName = 'H5';

export { H5 };

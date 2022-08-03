import { TextProps } from '../types';
import { EmText } from './Em.style';

const Em = ({ color, children, ...props }: TextProps<HTMLElement>): JSX.Element => (
  <EmText color={color} {...props}>
    {children}
  </EmText>
);

Em.displayName = 'Em';

export { Em };

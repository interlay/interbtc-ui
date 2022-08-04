import { TextProps } from '../types';
import { StrongText } from './Strong.style';

const Strong = ({ color, children, ...props }: TextProps<HTMLElement>): JSX.Element => (
  <StrongText color={color} {...props}>
    {children}
  </StrongText>
);

Strong.displayName = 'Strong';

export { Strong };

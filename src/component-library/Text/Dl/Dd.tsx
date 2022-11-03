import { TextProps } from '../types';
import { StyledDd } from './Dl.style';

type DdProps = TextProps<HTMLElement>;

const Dd = ({ color, children, ...props }: DdProps): JSX.Element => (
  <StyledDd color={color} {...props}>
    {children}
  </StyledDd>
);

Dd.displayName = 'Dd';

export { Dd };
export type { DdProps };

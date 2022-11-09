import { TextProps } from '../types';
import { StyledDt } from './Dl.style';

type DtProps = TextProps<HTMLElement>;

const Dt = ({ color = 'tertiary', children, ...props }: DtProps): JSX.Element => (
  <StyledDt color={color} {...props}>
    {children}
  </StyledDt>
);

Dt.displayName = 'Dt';

export { Dt };
export type { DtProps };

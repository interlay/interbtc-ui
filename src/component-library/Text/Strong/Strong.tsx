import { ReactNode } from 'react';

import { BaseTextProps } from '../types';
import { StrongText } from './Strong.style';

interface StrongProps extends BaseTextProps {
  children: ReactNode;
}

const Strong = ({ color, children }: StrongProps): JSX.Element => <StrongText color={color}>{children}</StrongText>;

Strong.displayName = 'Strong';

export { Strong };
export type { StrongProps };

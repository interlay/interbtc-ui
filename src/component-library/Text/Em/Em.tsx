import { ReactNode } from 'react';

import { BaseTextProps } from '..';
import { EmText } from './Em.style';

interface EmProps extends BaseTextProps {
  children: ReactNode;
}

const Em = ({ color, children }: EmProps): JSX.Element => <EmText color={color}>{children}</EmText>;

Em.displayName = 'Em';

export { Em };
export type { EmProps };

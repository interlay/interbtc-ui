import { ReactNode } from 'react';

import { BaseTextProps } from '../types';
import { H1Text } from './H1.style';

interface H1Props extends BaseTextProps {
  children: ReactNode;
}

const H1 = ({ color, children }: H1Props): JSX.Element => <H1Text color={color}>{children}</H1Text>;

H1.displayName = 'H1';

export { H1 };
export type { H1Props };

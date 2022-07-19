import { ReactNode } from 'react';

import { BaseTextProps } from '../types';
import { H3Text } from './H3.style';

interface H3Props extends BaseTextProps {
  children: ReactNode;
}

const H3 = ({ color, children }: H3Props): JSX.Element => <H3Text color={color}>{children}</H3Text>;

H3.displayName = 'H3';

export { H3 };
export type { H3Props };

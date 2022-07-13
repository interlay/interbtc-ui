import { ReactNode } from 'react';

import { BaseTextProps } from '..';
import { H6Text } from './H6.style';

interface H6Props extends BaseTextProps {
  children: ReactNode;
}

const H6 = ({ color, children }: H6Props): JSX.Element => <H6Text color={color}>{children}</H6Text>;

H6.displayName = 'H6';

export { H6 };
export type { H6Props };

import { ReactNode } from 'react';

import { BaseTextProps } from '..';
import { H4Text } from './H4.style';

interface H4Props extends BaseTextProps {
  children: ReactNode;
}

const H4 = ({ color, children }: H4Props): JSX.Element => <H4Text color={color}>{children}</H4Text>;

H4.displayName = 'H4';

export { H4 };
export type { H4Props };

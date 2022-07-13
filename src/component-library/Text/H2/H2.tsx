import { ReactNode } from 'react';

import { BaseTextProps } from '..';
import { H2Text } from './H2.style';

interface H2Props extends BaseTextProps {
  children: ReactNode;
}

const H2 = ({ color, children }: H2Props): JSX.Element => <H2Text color={color}>{children}</H2Text>;

export { H2 };
export type { H2Props };

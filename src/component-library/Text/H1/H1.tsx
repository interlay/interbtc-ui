import { ReactNode } from 'react';

import { BaseTextProps } from '..';
import { H1Text } from './H1.style';

interface H1Props extends BaseTextProps {
  children: ReactNode;
}

const H1 = ({ color, children }: H1Props): JSX.Element => <H1Text color={color}>{children}</H1Text>;

export { H1 };
export type { H1Props };

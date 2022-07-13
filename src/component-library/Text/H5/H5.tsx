import { ReactNode } from 'react';

import { BaseTextProps } from '..';
import { H5Text } from './H5.style';

interface H5Props extends BaseTextProps {
  children: ReactNode;
}

const H5 = ({ color, children }: H5Props): JSX.Element => <H5Text color={color}>{children}</H5Text>;

H5.displayName = 'H5';

export { H5 };
export type { H5Props };

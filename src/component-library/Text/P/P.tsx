import { ReactNode } from 'react';

import { BaseTextProps } from '..';
import { ParagraphText } from './P.style';

interface PProps extends BaseTextProps {
  children: ReactNode;
}

const P = ({ color, children }: PProps): JSX.Element => <ParagraphText color={color}>{children}</ParagraphText>;

export { P };
export type { PProps };

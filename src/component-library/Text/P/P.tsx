import { ReactNode } from 'react';

import { BaseTextProps } from '../types';
import { ParagraphText } from './P.style';

interface PProps extends BaseTextProps {
  children: ReactNode;
}

const P = ({ color, children }: PProps): JSX.Element => <ParagraphText color={color}>{children}</ParagraphText>;

P.displayName = 'P';

export { P };
export type { PProps };

import { TextProps } from '../types';
import { ParagraphText } from './P.style';

const P = ({ color, children, ...props }: TextProps<HTMLParagraphElement>): JSX.Element => (
  <ParagraphText color={color} {...props}>
    {children}
  </ParagraphText>
);

P.displayName = 'P';

export { P };

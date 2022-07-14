import styled from 'styled-components';

import { BaseTextProps, resolveTextColor } from '..';
import { theme } from '../..';

const ParagraphText = styled.p<BaseTextProps>`
  color: ${({ color }) => resolveTextColor(color)};
  line-height: ${theme.lineHeight.base};
  font-size: ${theme.text.base};
`;

export { ParagraphText };

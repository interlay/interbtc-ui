import styled from 'styled-components';

import { theme } from '../../theme';
import { TextProps } from '../types';
import { resolveTextColor } from '../utils';

const ParagraphText = styled.p<TextProps>`
  color: ${({ color }) => resolveTextColor(color)};
  line-height: ${theme.lineHeight.base};
  font-size: ${theme.text.base};
`;

export { ParagraphText };

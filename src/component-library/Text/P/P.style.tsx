import styled from 'styled-components';

import { theme } from '../../theme';
import { BaseTextProps } from '../types';
import { resolveTextColor } from '../utils';

const ParagraphText = styled.p<BaseTextProps>`
  color: ${({ color }) => resolveTextColor(color)};
  line-height: ${theme.lineHeight.base};
  font-size: ${theme.text.base};
`;

export { ParagraphText };

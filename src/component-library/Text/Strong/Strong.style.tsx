import styled from 'styled-components';

import { theme } from '../../theme';
import { TextProps } from '../types';
import { resolveTextColor } from '../utils';

const StrongText = styled.strong<TextProps>`
  color: ${({ color }) => resolveTextColor(color)};
  font-weight: ${theme.fontWeight.bold};
`;

export { StrongText };

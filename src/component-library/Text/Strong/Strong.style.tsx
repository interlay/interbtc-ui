import styled from 'styled-components';

import { theme } from '../../theme';
import { BaseTextProps } from '../types';
import { resolveTextColor } from '../utils';

const StrongText = styled.strong<BaseTextProps>`
  color: ${({ color }) => resolveTextColor(color)};
  font-weight: ${theme.fontWeight.bold};
`;

export { StrongText };

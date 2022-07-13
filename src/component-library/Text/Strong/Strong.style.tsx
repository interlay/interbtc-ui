import styled from 'styled-components';

import { theme } from '../..';
import { BaseTextProps, resolveTextColor } from '..';

const StrongText = styled.strong<BaseTextProps>`
  color: ${({ color }) => resolveTextColor(color)};
  font-weight: ${theme.fontWeight.bold};
`;

export { StrongText };

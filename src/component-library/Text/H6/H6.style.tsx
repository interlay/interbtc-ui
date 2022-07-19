import styled from 'styled-components';

import { theme } from '../../theme';
import { BaseTextProps } from '../types';
import { resolveTextColor } from '../utils';

const H6Text = styled.h6<BaseTextProps>`
  color: ${({ color }) => resolveTextColor(color)};
  font-size: ${theme.text.lg};
`;

export { H6Text };

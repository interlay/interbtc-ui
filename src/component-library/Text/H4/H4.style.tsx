import styled from 'styled-components';

import { theme } from '../../theme';
import { TextProps } from '../types';
import { resolveTextColor } from '../utils';

const H4Text = styled.h4<TextProps>`
  color: ${({ color }) => resolveTextColor(color)};
  font-size: ${theme.text.xl2};
`;

export { H4Text };

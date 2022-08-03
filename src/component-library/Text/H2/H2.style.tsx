import styled from 'styled-components';

import { theme } from '../../theme';
import { TextProps } from '../types';
import { resolveTextColor } from '../utils';

const H2Text = styled.h2<TextProps>`
  color: ${({ color }) => resolveTextColor(color)};
  font-size: ${theme.text.xl4};
`;

export { H2Text };

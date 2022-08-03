import styled from 'styled-components';

import { theme } from '../../theme';
import { TextProps } from '../types';
import { resolveTextColor } from '../utils';

const H1Text = styled.h1<TextProps>`
  color: ${({ color }) => resolveTextColor(color)};
  font-size: ${theme.text.xl5};
`;

export { H1Text };

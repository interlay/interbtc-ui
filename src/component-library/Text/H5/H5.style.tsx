import styled from 'styled-components';

import { theme } from '../../theme';
import { TextProps } from '../types';
import { resolveTextColor } from '../utils';

const H5Text = styled.h5<TextProps>`
  color: ${({ color }) => resolveTextColor(color)};
  font-size: ${theme.text.xl};
`;

export { H5Text };

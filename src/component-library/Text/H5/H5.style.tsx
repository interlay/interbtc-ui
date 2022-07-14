import styled from 'styled-components';

import { theme } from '../..';
import { BaseTextProps, resolveTextColor } from '..';

const H5Text = styled.h5<BaseTextProps>`
  color: ${({ color }) => resolveTextColor(color)};
  font-size: ${theme.text.xl};
`;

export { H5Text };

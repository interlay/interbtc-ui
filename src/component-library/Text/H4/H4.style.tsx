import styled from 'styled-components';

import { theme } from '../..';
import { BaseTextProps, resolveTextColor } from '..';

const H4Text = styled.h4<BaseTextProps>`
  color: ${({ color }) => resolveTextColor(color)};
  font-size: ${theme.text.xl2};
`;

export { H4Text };

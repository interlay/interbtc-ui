import styled from 'styled-components';

import { theme } from '../..';
import { BaseTextProps, resolveTextColor } from '..';

const H2Text = styled.h2<BaseTextProps>`
  color: ${({ color }) => resolveTextColor(color)};
  font-size: ${theme.text.xl4};
`;

export { H2Text };

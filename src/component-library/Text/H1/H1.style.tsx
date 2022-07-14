import styled from 'styled-components';

import { theme } from '../..';
import { BaseTextProps, resolveTextColor } from '..';

const H1Text = styled.h1<BaseTextProps>`
  color: ${({ color }) => resolveTextColor(color)};
  font-size: ${theme.text.xl5};
`;

export { H1Text };

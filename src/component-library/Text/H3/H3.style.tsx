import styled from 'styled-components';

import { theme } from '../..';
import { BaseTextProps, resolveTextColor } from '..';

const H3Text = styled.h3<BaseTextProps>`
  color: ${({ color }) => resolveTextColor(color)};
  font-size: ${theme.text.xl3};
`;

export { H3Text };

import styled from 'styled-components';

import { TextProps } from '../types';
import { resolveTextColor } from '../utils';

const EmText = styled.em<TextProps>`
  color: ${({ color }) => resolveTextColor(color)};
  font-style: italic;
`;

export { EmText };

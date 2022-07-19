import styled from 'styled-components';

import { BaseTextProps } from '../types';
import { resolveTextColor } from '../utils';

const EmText = styled.em<BaseTextProps>`
  color: ${({ color }) => resolveTextColor(color)};
  font-style: italic;
`;

export { EmText };

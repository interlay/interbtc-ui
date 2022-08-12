import styled from 'styled-components';

import { TextProps } from '../types';
import { resolveTextColor } from '../utils';

const SpanText = styled.span<TextProps>`
  color: ${({ color }) => resolveTextColor(color)};
`;

export { SpanText };

import styled from 'styled-components';

import { TextProps } from '../types';
import { resolveTextColor } from '../utils';

const StyledDt = styled.dt<TextProps>`
  color: ${({ color }) => resolveTextColor(color)};
`;

const StyledDd = styled.dd<TextProps>`
  color: ${({ color }) => resolveTextColor(color)};
`;

export { StyledDd, StyledDt };

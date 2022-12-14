import styled from 'styled-components';

import { theme } from '../theme';
import { Colors, FontWeight, NormalAlignments, Sizes } from '../utils/prop-types';
import { resolveHeight, resolveSize, resolveTextColor } from './utils';

type StyledTextProps = {
  $color?: Colors;
  $size?: Sizes;
  $align?: NormalAlignments;
  $weight?: FontWeight;
};

const Text = styled.p<StyledTextProps>`
  color: ${({ $color }) => resolveTextColor($color)};
  font-size: ${({ $size }) => resolveSize($size)};
  line-height: ${({ $size }) => resolveHeight($size)};
  font-weight: ${({ $weight }) => $weight && theme.fontWeight[$weight]};
  text-align: ${({ $align }) => $align};
`;

export { Text };
export type { StyledTextProps };

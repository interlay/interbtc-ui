import styled from 'styled-components';

import { theme } from '../theme';
import { Colors, FontSize, FontWeight, NormalAlignments } from '../utils/prop-types';
import { resolveHeight, resolveTextColor } from './utils';

type StyledTextProps = {
  $color?: Colors;
  $size?: FontSize;
  $align?: NormalAlignments;
  $weight?: FontWeight;
};

const Text = styled.p<StyledTextProps>`
  color: ${({ $color }) => resolveTextColor($color)};
  font-size: ${({ $size }) => $size && theme.text[$size]};
  line-height: ${({ $size }) => resolveHeight($size)};
  font-weight: ${({ $weight }) => $weight && theme.fontWeight[$weight]};
  text-align: ${({ $align }) => $align};
`;

export { Text };
export type { StyledTextProps };

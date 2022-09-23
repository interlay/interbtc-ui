import styled from 'styled-components';

import { Colors, Sizes } from '../utils/prop-types';
import { resolveHeight, resolveSize, resolveTextColor } from './utils';

type StyledTextProps = {
  $color?: Colors;
  $size?: Sizes;
};

const Text = styled.p<StyledTextProps>`
  color: ${({ $color }) => resolveTextColor($color)};
  font-size: ${({ $size }) => resolveSize($size)};
  line-height: ${({ $size }) => resolveHeight($size)};
`;

export { Text };
export type { StyledTextProps };

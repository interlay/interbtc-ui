import styled from 'styled-components';

import { theme } from '../theme';
import { Colors, IconSize } from '../utils/prop-types';
import { resolveColor } from '../utils/theme';

type StyledIconProps = {
  $size: IconSize;
  $color?: Colors;
};

const StyledIcon = styled.svg<StyledIconProps>`
  color: ${({ $color }) => resolveColor($color)};
  width: ${({ $size }) => theme.icon.sizes[$size]};
  height: ${({ $size }) => theme.icon.sizes[$size]};
  display: inline-block;
  user-select: none;
  flex-shrink: 0;
  overflow: hidden;
`;

export { StyledIcon };
export type { StyledIconProps };

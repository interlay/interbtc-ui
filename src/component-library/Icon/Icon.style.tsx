import styled from 'styled-components';

import { theme } from '../theme';
import { Colors, FontSize } from '../utils/prop-types';
import { resolveColor } from '../utils/theme';

type StyledIconProps = {
  $size?: FontSize;
  $color?: Colors;
};

const StyledIcon = styled.svg<StyledIconProps>`
  font-size: ${({ $size }) => $size && theme.text[$size]};
  color: ${({ $color }) => resolveColor($color)};
  width: 1.5em;
  height: 1.5em;
  display: inline-block;
  user-select: none;
  flex-shrink: 0;
  overflow: hidden;
`;

export { StyledIcon };
export type { StyledIconProps };

import styled from 'styled-components';

import { theme } from '../theme';
import { FontSize } from '../utils/prop-types';

type StyledIconProps = {
  $size?: FontSize;
};

const StyledIcon = styled.svg<StyledIconProps>`
  font-size: ${({ $size }) => $size && theme.text[$size]};
  width: 1.5em;
  height: 1.5em;
  display: inline-block;
  user-select: none;
  flex-shrink: 0;
  overflow: hidden;
`;

export { StyledIcon };
export type { StyledIconProps };

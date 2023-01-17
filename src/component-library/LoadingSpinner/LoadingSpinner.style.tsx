import styled from 'styled-components';

import { theme } from '../theme';
import { Colors, IconSize } from '../utils/prop-types';

interface StyledLoadingSpinnerProps {
  $thickness: number;
  $color: Colors;
  $size: IconSize;
}

const StyledLoadingSpinner = styled.span<StyledLoadingSpinnerProps>`
  display: inline-flex;
  position: relative;
  text-indent: -9999em;
  border-top: ${(props) => props.$thickness}px solid ${({ $color }) => theme.spinner[$color].bg};
  border-right: ${(props) => props.$thickness}px solid ${({ $color }) => theme.spinner[$color].bg};
  border-bottom: ${(props) => props.$thickness}px solid ${({ $color }) => theme.spinner[$color].bg};
  border-left: ${(props) => props.$thickness}px solid ${({ $color }) => theme.spinner[$color].color};
  transform: translateZ(0);
  animation: loadIndeterminate 1.1s infinite linear;

  width: ${({ $size }) => theme.icon.sizes[$size]};
  height: ${({ $size }) => theme.icon.sizes[$size]};
  display: inline-block;
  user-select: none;
  flex-shrink: 0;
  overflow: hidden;
  border-radius: 50%;

  &:after {
    border-radius: inherit;
    width: inherit;
    height: inherit;
  }

  @-webkit-keyframes loadIndeterminate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes loadIndeterminate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export type { StyledLoadingSpinnerProps };
export { StyledLoadingSpinner };

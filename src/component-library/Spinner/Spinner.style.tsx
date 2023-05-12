import styled from 'styled-components';

import { theme } from '../theme';
import { IconSize } from '../utils/prop-types';

type Variants = 'primary' | 'secondary' | 'outlined' | 'text';

type StyledSpinnerProps = {
  $size: IconSize;
  $variant: Variants;
};

const StyledSpinner = styled.svg<StyledSpinnerProps>`
  width: ${({ $size }) => theme.icon.sizes[$size]};
  height: ${({ $size }) => theme.icon.sizes[$size]};
  display: inline-block;
  user-select: none;
  flex-shrink: 0;
  overflow: hidden;

  position: relative;
  text-indent: -9999em;
  border-top: ${({ $size }) => theme.icon.sizes[$size]} solid
    ${({ $variant }) => theme.spinner.indeterminate[$variant].bg};
  border-right: ${({ $size }) => theme.icon.sizes[$size]} solid
    ${({ $variant }) => theme.spinner.indeterminate[$variant].bg};
  border-bottom: ${({ $size }) => theme.icon.sizes[$size]} solid
    ${({ $variant }) => theme.spinner.indeterminate[$variant].bg};
  border-left: ${({ $size }) => theme.icon.sizes[$size]} solid
    ${({ $variant }) => theme.spinner.indeterminate[$variant].color};
  transform: translateZ(0);
  animation: loadIndeterminate 1.1s infinite linear;

  &,
  &:after {
    border-radius: 50%;
    width: 2px;
    height: 2px;
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

export { StyledSpinner };
export type { StyledSpinnerProps };

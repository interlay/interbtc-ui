import styled from 'styled-components';

import { theme } from '../theme';

interface BaseLoadingSpinnerProps {
  $diameter: number;
  $thickness: number;
}

const BaseLoadingSpinner = styled.span<BaseLoadingSpinnerProps>`
  width: ${(props) => props.$diameter}px;
  height: ${(props) => props.$diameter}px;
  border: ${(props) => props.$thickness}px solid ${theme.spinner.determinate.bg};
  border-radius: 50%;
  position: relative;
  transform: rotate(45deg);
  box-sizing: border-box;

  &::before {
    content: '';
    position: absolute;
    box-sizing: border-box;
    inset: -${(props) => props.$thickness}px;
    border-radius: 50%;
    border: ${(props) => props.$thickness}px solid ${theme.spinner.determinate.color};
    animation: loadDeterminate 2s infinite linear;
  }

  @keyframes loadDeterminate {
    0% {
      clip-path: polygon(50% 50%, 0 0, 0 0, 0 0, 0 0, 0 0);
    }
    25% {
      clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 0, 100% 0, 100% 0);
    }
    50% {
      clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 100%, 100% 100%, 100% 100%);
    }
    75% {
      clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 100%, 0 100%, 0 100%);
    }
    100% {
      clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 100%, 0 100%, 0 0);
    }
  }
`;

const BaseIndeterminateLoadingSpinner = styled.span<BaseLoadingSpinnerProps>`
  position: relative;
  text-indent: -9999em;
  border-top: ${(props) => props.$thickness}px solid ${theme.spinner.indeterminate.bg};
  border-right: ${(props) => props.$thickness}px solid ${theme.spinner.indeterminate.bg};
  border-bottom: ${(props) => props.$thickness}px solid ${theme.spinner.indeterminate.bg};
  border-left: ${(props) => props.$thickness}px solid ${theme.spinner.indeterminate.color};
  transform: translateZ(0);
  animation: loadIndeterminate 1.1s infinite linear;

  &,
  &:after {
    border-radius: 50%;
    width: ${(props) => props.$diameter}px;
    height: ${(props) => props.$diameter}px;
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

export type { BaseLoadingSpinnerProps };

export { BaseIndeterminateLoadingSpinner, BaseLoadingSpinner };

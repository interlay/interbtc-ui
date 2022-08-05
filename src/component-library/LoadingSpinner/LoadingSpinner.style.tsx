import styled from 'styled-components';

import { theme } from '../theme';

interface BaseLoadingSpinnerProps {
  diameter?: number;
  thickness?: number;
}

const BaseLoadingSpinner = styled.span<BaseLoadingSpinnerProps>`
  width: ${(props) => props.diameter}px;
  height: ${(props) => props.diameter}px;
  border: ${(props) => props.thickness}px solid ${theme.cta.secondary.bg};
  border-radius: 50%;
  position: relative;
  transform: rotate(45deg);
  box-sizing: border-box;

  &::before {
    content: '';
    position: absolute;
    box-sizing: border-box;
    inset: -${(props) => props.thickness}px;
    border-radius: 50%;
    border: ${(props) => props.thickness}px solid ${theme.cta.primary.bg};
    animation: prixClipFix 2s infinite linear;
  }
  @keyframes prixClipFix {
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

export type { BaseLoadingSpinnerProps };

export { BaseLoadingSpinner };

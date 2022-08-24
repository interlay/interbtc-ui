import styled from 'styled-components';

import { TransitionTrigger } from '@/utils/hooks/use-mount-transition';

import { theme } from '../theme';

interface ModalContentProps {
  transitionTrigger: TransitionTrigger;
}

const ModalContainer = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalOverlay = styled.div`
  position: absolute;
  width: 100vw;
  height: 100vh;
  background: ${theme.overlay.bg};
`;

const ModalContent = styled.div<ModalContentProps>`
  position: relative;
  width: 100%;
  z-index: 2;
  max-width: 32em;
  margin: 1.5em;
  background: ${theme.colors.bgPrimary};
  border: ${theme.border.default};
  padding: ${theme.spacing.spacing8};
  border-radius: ${theme.rounded.md};
  color: ${theme.colors.textPrimary};
  transition: opacity ${theme.transition.duration}ms ease-out;
  transition-property: opacity, transform;
  ${({ transitionTrigger }) =>
    transitionTrigger === 'in' ? `opacity: 1; transform: translateY(0);` : `opacity: 0; transform: translateY(2em);`}
`;

const CloseIcon = styled.button`
  display: inline-flex;
  position: absolute;
  top: 0.5em;
  right: 0.5em;
  background: none;
  color: inherit;
  border: none;
  padding: ${theme.spacing.spacing1};
  font: inherit;
  cursor: pointer;
  outline: inherit;
  fill: ${theme.colors.textSecondary};
`;

export { CloseIcon, ModalContainer, ModalContent, ModalOverlay };

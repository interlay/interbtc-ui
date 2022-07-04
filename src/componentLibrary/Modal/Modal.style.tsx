import styled from 'styled-components';

import { theme } from 'componentLibrary/theme';
import { TransitionTrigger } from 'utils/hooks/use-mount-transition';

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
`;

const ModalContent = styled.div<ModalContentProps>`
  position: relative;
  width: 100%;
  z-index: 2;
  max-width: 32em;
  margin: 1.5em;
  background: ${theme.colors.bgPrimary};
  padding: ${theme.spacing.spacing4};
  border-radius: ${theme.rounded.md};
  color: ${theme.colors.textPrimary};
  transition: opacity ${theme.transition.duration}ms ease-out;
  transition-property: opacity, transform;
  ${({ transitionTrigger }) =>
    transitionTrigger === 'in' ? `opacity: 1; transform: translateY(0);` : `opacity: 0; transform: translateY(2em);`}
`;

const CloseIcon = styled.button`
  position: absolute;
  top: 0.5em;
  right: 0.5em;
  background: none;
  color: inherit;
  border: none;
  padding: 0;
  font: inherit;
  cursor: pointer;
  outline: inherit;
  fill: ${theme.colors.textSecondary};
`;

export { ModalContainer, ModalOverlay, ModalContent, CloseIcon };

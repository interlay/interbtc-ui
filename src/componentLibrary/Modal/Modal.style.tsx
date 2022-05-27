import styled from 'styled-components';

import { theme } from 'componentLibrary/theme';

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

const ModalContent = styled.div`
  position: relative;
  width: 100%;
  z-index: 2;
  max-width: 32em;
  margin: 1.5em;
  background: ${theme.modal.bg};
  padding: ${theme.spacing.spacing4};
  border-radius: ${theme.rounded.md};
  color: ${theme.colors.textSecondary};
`;

const CloseIcon = styled.div`
  position: absolute;
  top: 0;
  right: 0;
`;

export { ModalContainer, ModalOverlay, ModalContent, CloseIcon };

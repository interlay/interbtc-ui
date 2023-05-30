import styled from 'styled-components';

import { overlayCSS } from '../css/overlay';
import { Dialog, DialogBody } from '../Dialog';
import { theme } from '../theme';
import { Overflow } from '../utils/prop-types';

type StyledModalProps = {
  $isOpen?: boolean;
  $isCentered?: boolean;
};

type StyledDialogProps = {
  $isCentered?: boolean;
  $hasMaxHeight?: boolean;
};

type StyledModalBodyProps = {
  $overflow?: Overflow;
  $noPadding?: boolean;
};

const StyledWrapper = styled.div<StyledModalProps>`
  position: fixed;
  top: 0;
  left: 0;
  z-index: ${theme.modal.zIndex};
  width: 100vw;
  height: 100vh;
  visibility: visible;

  display: flex;
  justify-content: center;
  align-items: ${({ $isCentered }) => ($isCentered ? 'center' : 'flex-start')};
  overflow: ${({ $isCentered }) => !$isCentered && 'auto'};
`;

const StyledModal = styled.div<StyledModalProps>`
  max-height: ${({ $isCentered }) => $isCentered && theme.modal.maxHeight};
  margin: ${({ $isCentered }) => ($isCentered ? 0 : theme.spacing.spacing16)} ${theme.spacing.spacing6};

  transform: ${({ $isOpen }) => ($isOpen ? 'translateY(0)' : `translateY(20px)`)};
  ${({ $isOpen }) => overlayCSS(!!$isOpen)}
  // Overrides overlayCSS properties, because react-aria Overlay
  // contains a FocusScope that will ignore this element if it is
  // visually hidden
  visibility: visible;
  // Allows scroll on the modal
  pointer-events: auto;
  transition: ${({ $isOpen }) => ($isOpen ? theme.modal.transition.entering : theme.modal.transition.exiting)};

  outline: none;
`;

const StyledDialog = styled(Dialog)<StyledDialogProps>`
  max-height: ${({ $hasMaxHeight }) => $hasMaxHeight && '560px'};
  overflow: ${({ $isCentered }) => $isCentered && 'hidden'};
`;

const StyledDialogBody = styled(DialogBody)<StyledModalBodyProps>`
  overflow-y: ${({ $overflow }) => $overflow};
  position: relative;
  padding: ${({ $noPadding }) => $noPadding && 0};
`;

export { StyledDialog, StyledDialogBody, StyledModal, StyledWrapper };

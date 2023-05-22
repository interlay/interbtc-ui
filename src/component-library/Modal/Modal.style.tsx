import styled from 'styled-components';

import { overlayCSS } from '../css/overlay';
import { CTA } from '../CTA';
import { Divider } from '../Divider';
import { Flex } from '../Flex';
import { H3 } from '../Text';
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

type StyledUnderlayProps = {
  $isOpen: boolean;
  $isCentered?: boolean;
};

const StyledUnderlay = styled.div<StyledUnderlayProps>`
  position: fixed;
  z-index: ${theme.modal.underlay.zIndex};
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;

  background: ${theme.modal.underlay.bg};

  ${({ $isOpen }) => overlayCSS($isOpen)}
  transition: ${({ $isOpen }) =>
    $isOpen ? theme.modal.underlay.transition.entering : theme.modal.underlay.transition.exiting};
`;

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
  width: 100%;
  max-width: ${theme.modal.maxWidth};
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

const StyledDialog = styled.section<StyledDialogProps>`
  background: ${theme.colors.bgPrimary};
  border: ${theme.border.default};
  border-radius: ${theme.rounded.md};
  color: ${theme.colors.textPrimary};

  width: 100%;
  max-height: ${({ $hasMaxHeight }) => $hasMaxHeight && '560px'};
  overflow: ${({ $isCentered }) => $isCentered && 'hidden'};

  display: flex;
  flex-direction: column;
  position: relative;

  outline: none;
`;

const StyledCloseCTA = styled(CTA)`
  position: absolute;
  top: ${theme.spacing.spacing2};
  right: ${theme.spacing.spacing2};
  z-index: ${theme.modal.closeBtn.zIndex};
`;

const StyledModalHeader = styled(H3)`
  padding: ${theme.modal.header.paddingY} ${theme.modal.header.paddingRight} ${theme.modal.header.paddingY}
    ${theme.modal.header.paddingX};
  flex-shrink: 0;
`;

const StyledModalDivider = styled(Divider)`
  margin: 0 ${theme.modal.divider.marginX} ${theme.modal.divider.marginBottom};
  flex-shrink: 0;
`;

const StyledModalBody = styled(Flex)<StyledModalBodyProps>`
  flex: 1 1 auto;
  overflow-y: ${({ $overflow }) => $overflow};
  position: relative;
  padding: ${({ $noPadding }) => !$noPadding && `${theme.modal.body.paddingY} ${theme.modal.body.paddingX}`};
`;

const StyledModalFooter = styled(Flex)`
  padding: ${theme.modal.footer.paddingTop} ${theme.modal.footer.paddingX} ${theme.modal.footer.paddingBottom};
`;

export {
  StyledCloseCTA,
  StyledDialog,
  StyledModal,
  StyledModalBody,
  StyledModalDivider,
  StyledModalFooter,
  StyledModalHeader,
  StyledUnderlay,
  StyledWrapper
};

import styled from 'styled-components';

import { TransitionTrigger } from '@/utils/hooks/use-mount-transition';

import { CTA } from '../CTA';
import { Divider } from '../Divider';
import { Flex } from '../Flex';
import { H3 } from '../Text';
import { theme } from '../theme';
import { NormalAlignments, Overflow } from '../utils/prop-types';

type StyledDialogWrapperProps = {
  $transitionTrigger?: TransitionTrigger;
  $isCentered?: boolean;
};

type StyledDialogProps = {
  $isCentered?: boolean;
};

type StyledModalHeaderProps = {
  $alignment?: NormalAlignments;
};

type StyledModalBodyProps = {
  $overflow?: Overflow;
  $noPadding?: boolean;
};

const StyledUnderlay = styled.div`
  position: fixed;
  z-index: ${theme.modal.underlay.zIndex};
  inset: 0;
  background: ${theme.modal.underlay.bg};
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  overflow: hidden;
  pointer-events: auto;
`;

const StyledDialogWrapper = styled.div<StyledDialogWrapperProps>`
  width: 100vw;
  height: 100vh;
  justify-content: center;
  align-items: ${({ $isCentered }) => ($isCentered ? 'center' : 'flex-start')};
  display: flex;
  position: fixed;
  pointer-events: ${({ $isCentered }) => $isCentered && 'none'};
  overflow: ${({ $isCentered }) => !$isCentered && 'auto'};
  z-index: ${theme.modal.zIndex};
  top: 0;
  left: 0;
  transition: opacity ${theme.transition.duration.duration100}ms ease-out;
  transition-property: opacity, transform;
  ${({ $transitionTrigger }) =>
    $transitionTrigger === 'in' ? `opacity: 1; transform: translateY(0);` : `opacity: 0; transform: translateY(2em);`}
`;

const StyledDialog = styled.section<StyledDialogProps>`
  background: ${theme.colors.bgPrimary};
  border: ${theme.border.default};
  border-radius: ${theme.rounded.md};
  color: ${theme.colors.textPrimary};

  max-width: ${theme.modal.maxWidth};
  width: 100%;
  max-height: ${({ $isCentered }) => $isCentered && theme.modal.maxHeight};
  overflow: ${({ $isCentered }) => $isCentered && 'hidden'};
  margin: ${({ $isCentered }) => ($isCentered ? 0 : theme.spacing.spacing16)} ${theme.spacing.spacing6};
  pointer-events: auto;

  display: flex;
  flex-direction: column;
  position: relative;
`;

const StyledCloseCTA = styled(CTA)`
  position: absolute;
  top: ${theme.spacing.spacing2};
  right: ${theme.spacing.spacing2};
  z-index: ${theme.modal.closeBtn.zIndex};
`;

const StyledModalHeader = styled(H3)<StyledModalHeaderProps>`
  font-size: ${theme.text.xl};
  line-height: ${theme.lineHeight.base};
  text-align: ${({ $alignment }) => $alignment};
  padding: ${theme.modal.header.paddingY} ${theme.modal.header.paddingX};
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
  StyledDialogWrapper,
  StyledModalBody,
  StyledModalDivider,
  StyledModalFooter,
  StyledModalHeader,
  StyledUnderlay
};

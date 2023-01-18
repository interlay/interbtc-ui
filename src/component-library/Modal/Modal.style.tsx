import styled from 'styled-components';

import { TransitionTrigger } from '@/utils/hooks/use-mount-transition';

import { CTA } from '../CTA';
import { Divider } from '../Divider';
import { Flex } from '../Flex';
import { H3 } from '../Text';
import { theme } from '../theme';
import { Overflow } from '../utils/prop-types';

type StyledDialogWrapperProps = {
  $transitionTrigger?: TransitionTrigger;
  $isCentered?: boolean;
};

type StyledDialogProps = {
  $isCentered?: boolean;
};

type StyledModalBodyProps = {
  $overflow?: Overflow;
  $noPadding?: boolean;
};

const StyledUnderlay = styled.div<Pick<StyledDialogWrapperProps, '$isCentered'>>`
  position: fixed;
  z-index: ${theme.modal.underlay.zIndex};
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;

  background: ${theme.modal.underlay.bg};
  display: flex;
  justify-content: center;
  align-items: ${({ $isCentered }) => ($isCentered ? 'center' : 'flex-start')};
  overflow: ${({ $isCentered }) => !$isCentered && 'auto'};
`;

const StyledDialogWrapper = styled.div<StyledDialogWrapperProps>`
  justify-content: center;
  display: flex;
  z-index: ${theme.modal.zIndex};
  transition: opacity ${theme.transition.duration.duration100}ms ease-out;
  margin: ${({ $isCentered }) => ($isCentered ? 0 : theme.spacing.spacing16)} ${theme.spacing.spacing6};
  max-width: ${theme.modal.maxWidth};
  max-height: ${({ $isCentered }) => $isCentered && theme.modal.maxHeight};
  width: 100%;
  transition-property: opacity, transform;
  ${({ $transitionTrigger }) =>
    $transitionTrigger === 'in' ? `opacity: 1; transform: translateY(0);` : `opacity: 0; transform: translateY(2em);`}
`;

const StyledDialog = styled.section<StyledDialogProps>`
  background: ${theme.colors.bgPrimary};
  border: ${theme.border.default};
  border-radius: ${theme.rounded.md};
  color: ${theme.colors.textPrimary};

  width: 100%;
  overflow: ${({ $isCentered }) => $isCentered && 'hidden'};
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

const StyledModalHeader = styled(H3)`
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

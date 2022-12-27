import styled from 'styled-components';

import { TransitionTrigger } from '@/utils/hooks/use-mount-transition';

import { CTA } from '../CTA';
import { Divider } from '../Divider';
import { Stack } from '../Stack';
import { H3 } from '../Text';
import { theme } from '../theme';
import { NormalAlignments } from '../utils/prop-types';

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

type StyledDialogWrapperProps = {
  $transitionTrigger?: TransitionTrigger;
};

const StyledDialogWrapper = styled.div<StyledDialogWrapperProps>`
  width: 100vw;
  height: 100vh;
  justify-content: center;
  align-items: center;
  display: flex;
  position: fixed;
  pointer-events: none;
  z-index: ${theme.modal.zIndex};
  top: 0;
  left: 0;

  transition: opacity ${theme.transition.duration.duration100}ms ease-out;
  transition-property: opacity, transform;
  ${({ $transitionTrigger }) =>
    $transitionTrigger === 'in' ? `opacity: 1; transform: translateY(0);` : `opacity: 0; transform: translateY(2em);`}
`;

const StyledDialog = styled.section`
  background: ${theme.colors.bgPrimary};
  border: ${theme.border.default};
  border-radius: ${theme.rounded.md};
  color: ${theme.colors.textPrimary};

  max-width: ${theme.modal.maxWidth};
  max-height: ${theme.modal.maxHeight};
  margin: 0 ${theme.spacing.spacing6};
  pointer-events: auto;

  display: grid;
  grid-template-columns: ${theme.spacing.spacing6} auto ${theme.spacing.spacing3} ${theme.spacing.spacing6};
  grid-template-rows: ${theme.spacing.spacing6} ${theme.spacing.spacing3} auto auto 1fr auto ${theme.spacing.spacing6};

  @media (min-width: ${theme.layout.breakpoints.lg}) {
    grid-template-columns: ${theme.spacing.spacing8} auto ${theme.spacing.spacing3} ${theme.spacing.spacing8};
    grid-template-rows: ${theme.spacing.spacing8} ${theme.spacing.spacing3} auto auto 1fr auto ${theme.spacing.spacing8};
  }
`;

const StyledCloseCTA = styled(CTA)`
  margin: ${theme.spacing.spacing3} ${theme.spacing.spacing3} 0 0;
  padding: 0;

  grid-column: 3 / span 2;
  grid-row: 1 / span 2;
`;

type StyledModalTitleProps = {
  $alignment?: NormalAlignments;
};

const StyledModalTitle = styled(H3)<StyledModalTitleProps>`
  font-size: ${theme.text.xl};
  line-height: ${theme.lineHeight.base};
  text-align: ${({ $alignment }) => $alignment};
  margin-bottom: ${theme.spacing.spacing3};

  grid-column: 2 / span 2;
  grid-row: 3 / span 1;
`;

const StyledModalDivider = styled(Divider)`
  margin: 0 0 ${theme.spacing.spacing4} 0;

  grid-column: 2 / span 2;
  grid-row: 4 / span 1;
`;

const StyledModalBody = styled(Stack)`
  overflow-y: auto;
  padding: 0 ${theme.spacing.spacing6};

  grid-column: 1 / span 4;
  grid-row: 5 / span 1;

  @media (min-width: ${theme.layout.breakpoints.lg}) {
    padding: 0 ${theme.spacing.spacing8};
  }
`;

const StyledModalFooter = styled(Stack)`
  padding-top: ${theme.spacing.spacing6};

  grid-column: 2 / span 2;
  grid-row: 6 / span 1;
`;

export {
  StyledCloseCTA,
  StyledDialog,
  StyledDialogWrapper,
  StyledModalBody,
  StyledModalDivider,
  StyledModalFooter,
  StyledModalTitle,
  StyledUnderlay
};

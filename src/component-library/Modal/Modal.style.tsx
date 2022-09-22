import styled from 'styled-components';

import { TransitionTrigger } from '@/utils/hooks/use-mount-transition';

import { CTA } from '../CTA';
import { Stack } from '../Stack';
import { H3 } from '../Text';
import { theme } from '../theme';
import { NormalAlignments, Variants } from '../utils/prop-types';

const StyledUnderlay = styled.div`
  position: fixed;
  z-index: ${theme.modal.underlay.zIndex};
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: ${theme.modal.underlay.bg};
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

type StyledDialogProps = {
  $transitionTrigger?: TransitionTrigger;
};

const StyledDialog = styled.div<StyledDialogProps>`
  max-height: inherit;
  width: 100vw;
  max-height: ${theme.modal.maxHeight};
  z-index: ${theme.modal.zIndex};
  max-width: ${theme.modal.maxWidth};
  margin: 0 ${theme.spacing.spacing6};
  background: ${theme.colors.bgPrimary};
  border: ${theme.border.default};
  border-radius: ${theme.rounded.md};
  color: ${theme.colors.textPrimary};
  transition: opacity ${theme.transition.duration}ms ease-out;
  transition-property: opacity, transform;
  ${({ $transitionTrigger }) =>
    $transitionTrigger === 'in' ? `opacity: 1; transform: translateY(0);` : `opacity: 0; transform: translateY(2em);`}

  display: grid;
  grid-template-columns: ${theme.spacing.spacing8} auto ${theme.spacing.spacing3} ${theme.spacing.spacing8};
  grid-template-rows: ${theme.spacing.spacing8} ${theme.spacing.spacing3} auto auto 1fr auto ${theme.spacing.spacing8};
  grid-template-areas:
    '. . close-btn close-btn'
    '. . close-btn close-btn'
    '. title title .'
    '. divider divider .'
    '. content content .'
    '. footer cotent .';
`;

const StyledCloseCTA = styled(CTA)`
  grid-area: close-btn;
  margin: ${theme.spacing.spacing3} ${theme.spacing.spacing3} 0 0;
  padding: 0;
`;

type StyledTitleProps = {
  $variant: Exclude<Variants, 'outlined' | 'text'>;
  $alignment?: NormalAlignments;
};

const StyledTitle = styled(H3)<StyledTitleProps>`
  grid-area: title;
  font-size: ${theme.text.xl};
  line-height: ${theme.lineHeight.base};
  color: ${({ $variant }) => theme.modal.title[$variant].color};
  text-align: ${({ $variant, $alignment }) => $alignment || theme.modal.title[$variant].textAlign};
  margin-bottom: ${theme.spacing.spacing4};
`;

const StyledHr = styled.hr`
  grid-area: divider;
  border-bottom: ${theme.modal.divider.border};
  margin: 0 0 ${theme.spacing.spacing4} 0;
`;

const StyledModalBody = styled(Stack)`
  grid-area: content;
  overflow-y: auto;
`;

const StyledModalFooter = styled(Stack)`
  grid-area: footer;
  padding-top: ${theme.spacing.spacing6};
`;

export { StyledCloseCTA, StyledDialog, StyledHr, StyledModalBody, StyledModalFooter, StyledTitle, StyledUnderlay };

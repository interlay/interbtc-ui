import styled from 'styled-components';

import { TransitionTrigger } from '@/utils/hooks/use-mount-transition';

import { Stack } from '../Stack';
import { H3 } from '../Text';
import { theme } from '../theme';

// NEW

const Underlay = styled.div`
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

type DialogProps = {
  $transitionTrigger?: TransitionTrigger;
};

const Dialog = styled.div<DialogProps>`
  max-height: inherit;
  width: 100vw;
  max-height: calc(100vh - 3em);
  z-index: 2;
  max-width: 32em;
  margin: 0 1.5em;
  background: ${theme.colors.bgPrimary};
  border: ${theme.border.default};
  border-radius: ${theme.rounded.md};
  color: ${theme.colors.textPrimary};
  transition: opacity ${theme.transition.duration}ms ease-out;
  transition-property: opacity, transform;
  ${({ $transitionTrigger }) =>
    $transitionTrigger === 'in' ? `opacity: 1; transform: translateY(0);` : `opacity: 0; transform: translateY(2em);`}

  display: grid;
  grid-template-columns: ${theme.spacing.spacing10} auto ${theme.spacing.spacing1} ${theme.spacing.spacing10};
  grid-template-rows: ${theme.spacing.spacing10} ${theme.spacing.spacing1} auto 1fr auto ${theme.spacing.spacing8};
  grid-template-areas:
    '. . close-btn close-btn'
    '. . close-btn close-btn'
    '. title title .'
    '. content content .'
    '. footer cotent .';
`;

const CloseIcon = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: none;
  color: inherit;
  border: none;
  font: inherit;
  margin: ${theme.spacing.spacing3} ${theme.spacing.spacing3} 0 0;
  padding: 0;
  cursor: pointer;
  outline: inherit;
  fill: ${theme.colors.textSecondary};
  grid-area: close-btn;
`;

const Title = styled(H3)`
  font-size: ${theme.text.xl2};
  line-height: ${theme.lineHeight.xl};
  margin-bottom: ${theme.spacing.spacing4};
  grid-area: title;
`;

const StyledModalBody = styled(Stack)`
  overflow-y: auto;
  grid-area: content;
`;

const StyledModalFooter = styled(Stack)`
  grid-area: footer;
  padding-top: ${theme.spacing.spacing4};
`;

export { CloseIcon, Dialog, StyledModalBody, StyledModalFooter, Title, Underlay };

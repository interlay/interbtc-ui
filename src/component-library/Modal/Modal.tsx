import { AriaDialogProps, useDialog } from '@react-aria/dialog';
import { FocusScope } from '@react-aria/focus';
import { AriaOverlayProps, OverlayContainer, useModalOverlay, usePreventScroll } from '@react-aria/overlays';
import { useOverlayTriggerState } from '@react-stately/overlays';
import { forwardRef, ReactNode } from 'react';

import { useMountTransition } from '@/utils/hooks/use-mount-transition';

import { Icon } from '../Icon';
import { theme } from '../theme';
import { useDOMRef } from '../utils/dom';
import { StyledCloseCTA, StyledDialog, StyledUnderlay } from './Modal.style';
import { ModalContext } from './ModalContext';

type Props = {
  children: ReactNode;
};

type InheritAttrs = Omit<AriaDialogProps & AriaOverlayProps, keyof Props>;

type ModalProps = Props & InheritAttrs;

const Modal = forwardRef<HTMLDivElement, ModalProps>(
  ({ children, isDismissable = true, ...props }, ref): JSX.Element | null => {
    const dialogRef = useDOMRef(ref);
    const state = useOverlayTriggerState(props);

    const { isOpen, onClose } = props;
    const { shouldRender, transitionTrigger } = useMountTransition(!!isOpen, theme.transition.duration.duration100);

    // Handle interacting outside the dialog and pressing
    // the Escape key to close the modal.
    const { modalProps, underlayProps } = useModalOverlay({ isDismissable, ...props }, state, dialogRef);

    // Prevent scrolling while the modal is open, and hide content
    // outside the modal from screen readers.
    usePreventScroll();

    // Get props for the dialog and its title
    const { dialogProps, titleProps } = useDialog(props, dialogRef);

    console.log(isOpen, transitionTrigger);

    return isOpen || shouldRender ? (
      <OverlayContainer>
        <StyledUnderlay {...underlayProps}>
          <FocusScope contain restoreFocus autoFocus>
            <ModalContext.Provider value={{ titleProps }}>
              <StyledDialog
                $transitionTrigger={transitionTrigger}
                ref={dialogRef}
                {...modalProps}
                {...dialogProps}
                {...modalProps}
              >
                <StyledCloseCTA size='small' variant='text' aria-label='Dismiss' onClick={onClose}>
                  <Icon width='1.5em' height='1.5em' variant='close' />
                </StyledCloseCTA>
                {children}
              </StyledDialog>
            </ModalContext.Provider>
          </FocusScope>
        </StyledUnderlay>
      </OverlayContainer>
    ) : null;
  }
);

Modal.displayName = 'Modal';

export { Modal };
export type { ModalProps };

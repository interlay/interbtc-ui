import { AriaDialogProps, useDialog } from '@react-aria/dialog';
import { FocusScope } from '@react-aria/focus';
import { AriaOverlayProps, OverlayContainer, useModalOverlay } from '@react-aria/overlays';
import { OverlayTriggerState } from '@react-stately/overlays';
import { forwardRef, ReactNode } from 'react';

import { useMountTransition } from '@/utils/hooks/use-mount-transition';

import { Icon } from '../Icon';
import { theme } from '../theme';
import { useDOMRef } from '../utils/dom';
import { StyledCloseCTA, StyledDialog, StyledDialogWrapper, StyledUnderlay } from './Modal.style';
import { ModalContext } from './ModalContext';

type Props = {
  children: ReactNode;
};

type InheritAttrs = Omit<AriaDialogProps & AriaOverlayProps, keyof Props>;

type ModalProps = Props & InheritAttrs;

// TODO: handle better title + divider spacing
const Modal = forwardRef<HTMLDivElement, ModalProps>(
  ({ children, isDismissable = true, ...props }, ref): JSX.Element | null => {
    const dialogRef = useDOMRef(ref);
    const { isOpen, onClose } = props;
    const { shouldRender, transitionTrigger } = useMountTransition(!!isOpen, theme.transition.duration.duration100);

    // Handle interacting outside the dialog and pressing
    // the Escape key to close the modal.
    const { modalProps, underlayProps } = useModalOverlay(
      { isDismissable, ...props },
      // These are the only props needed
      { isOpen: !!isOpen, close: onClose } as OverlayTriggerState,
      dialogRef
    );

    // Get props for the dialog and its title
    const { dialogProps, titleProps } = useDialog(props, dialogRef);

    return isOpen || shouldRender ? (
      <OverlayContainer>
        <StyledUnderlay {...underlayProps} />
        <FocusScope contain restoreFocus autoFocus>
          <StyledDialogWrapper ref={dialogRef} {...modalProps} $transitionTrigger={transitionTrigger}>
            <ModalContext.Provider value={{ titleProps }}>
              <StyledDialog {...dialogProps}>
                <StyledCloseCTA size='small' variant='text' aria-label='Dismiss' onClick={onClose}>
                  <Icon width='1.5em' height='1.5em' variant='close' />
                </StyledCloseCTA>
                {children}
              </StyledDialog>
            </ModalContext.Provider>
          </StyledDialogWrapper>
        </FocusScope>
      </OverlayContainer>
    ) : null;
  }
);

Modal.displayName = 'Modal';

export { Modal };
export type { ModalProps };

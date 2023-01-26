import { AriaDialogProps, useDialog } from '@react-aria/dialog';
import { FocusScope } from '@react-aria/focus';
import { AriaOverlayProps, OverlayContainer, useModalOverlay } from '@react-aria/overlays';
import { OverlayTriggerState } from '@react-stately/overlays';
import { forwardRef, ReactNode } from 'react';

import { XMark } from '@/assets/icons';
import { useMountTransition } from '@/utils/hooks/use-mount-transition';

import { theme } from '../theme';
import { useDOMRef } from '../utils/dom';
import { StyledCloseCTA, StyledDialog, StyledDialogWrapper, StyledUnderlay } from './Modal.style';
import { ModalContext } from './ModalContext';

type Props = {
  children: ReactNode;
  align?: 'top' | 'center';
  hasMaxHeight?: boolean;
};

type InheritAttrs = Omit<AriaDialogProps & AriaOverlayProps, keyof Props>;

type ModalProps = Props & InheritAttrs;

const Modal = forwardRef<HTMLDivElement, ModalProps>(
  ({ children, isDismissable = true, align = 'center', hasMaxHeight, ...props }, ref): JSX.Element | null => {
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

    const isCentered = align === 'center';

    return isOpen || shouldRender ? (
      <OverlayContainer>
        <StyledUnderlay {...underlayProps} $isCentered={isCentered}>
          <FocusScope contain restoreFocus autoFocus>
            <StyledDialogWrapper
              ref={dialogRef}
              $transitionTrigger={transitionTrigger}
              $isCentered={isCentered}
              {...modalProps}
            >
              <ModalContext.Provider value={{ titleProps, bodyProps: { overflow: isCentered ? 'auto' : undefined } }}>
                <StyledDialog $isCentered={isCentered} $hasMaxHeight={hasMaxHeight} {...dialogProps}>
                  <StyledCloseCTA size='small' variant='text' aria-label='Dismiss' onPress={onClose}>
                    <XMark />
                  </StyledCloseCTA>
                  {children}
                </StyledDialog>
              </ModalContext.Provider>
            </StyledDialogWrapper>
          </FocusScope>
        </StyledUnderlay>
      </OverlayContainer>
    ) : null;
  }
);

Modal.displayName = 'Modal';

export { Modal };
export type { ModalProps };

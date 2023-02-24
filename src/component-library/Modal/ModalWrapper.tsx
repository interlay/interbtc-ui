import { AriaModalOverlayProps, AriaOverlayProps, useModalOverlay } from '@react-aria/overlays';
import { mergeProps } from '@react-aria/utils';
import { OverlayTriggerState } from '@react-stately/overlays';
import { forwardRef, ReactNode } from 'react';

import { useDOMRef } from '../utils/dom';
import { StyledModal, StyledUnderlay } from './Modal.style';

type Props = {
  children: ReactNode;
  align?: 'top' | 'center';
  isOpen?: boolean;
  onClose: () => void;
};

type InheritAttrs = Omit<AriaModalOverlayProps & AriaOverlayProps, keyof Props>;

type ModalWrapperProps = Props & InheritAttrs;

const ModalWrapper = forwardRef<HTMLDivElement, ModalWrapperProps>(
  (
    { children, isDismissable = true, align = 'center', onClose, isKeyboardDismissDisabled, isOpen, ...props },
    ref
  ): JSX.Element | null => {
    const modalRef = useDOMRef(ref);

    // Handle interacting outside the dialog and pressing
    // the Escape key to close the modal.
    const { modalProps, underlayProps } = useModalOverlay(
      { isDismissable, isKeyboardDismissDisabled, ...props },
      // These are the only props needed
      { isOpen: !!isOpen, close: onClose } as OverlayTriggerState,
      modalRef
    );

    const isCentered = align === 'center';

    return (
      <StyledUnderlay {...underlayProps} $isOpen={!!isOpen} $isCentered={isCentered}>
        <StyledModal ref={modalRef} $isOpen={isOpen} $isCentered={isCentered} {...mergeProps(modalProps, props)}>
          {children}
        </StyledModal>
      </StyledUnderlay>
    );
  }
);

ModalWrapper.displayName = 'ModalWrapper';

export { ModalWrapper };
export type { ModalWrapperProps };

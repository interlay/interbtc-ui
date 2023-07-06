import { AriaModalOverlayProps, AriaOverlayProps, useModalOverlay } from '@react-aria/overlays';
import { mergeProps } from '@react-aria/utils';
import { OverlayTriggerState } from '@react-stately/overlays';
import { forwardRef, ReactNode, RefObject } from 'react';

import { Underlay } from '../Overlay/Underlay';
import { StyledModal, StyledWrapper } from './Modal.style';

type Props = {
  children: ReactNode;
  align?: 'top' | 'center';
  isOpen?: boolean;
  onClose: () => void;
  wrapperRef: RefObject<HTMLDivElement>;
};

type InheritAttrs = Omit<AriaModalOverlayProps & AriaOverlayProps, keyof Props>;

type ModalWrapperProps = Props & InheritAttrs;

const ModalWrapper = forwardRef<HTMLDivElement, ModalWrapperProps>(
  (
    {
      children,
      isDismissable = true,
      align = 'center',
      onClose,
      isKeyboardDismissDisabled,
      isOpen,
      shouldCloseOnInteractOutside,
      shouldCloseOnBlur,
      wrapperRef,
      ...props
    },
    ref
  ): JSX.Element | null => {
    // Handle interacting outside the dialog and pressing
    // the Escape key to close the modal.
    const { modalProps, underlayProps } = useModalOverlay(
      {
        isDismissable,
        isKeyboardDismissDisabled,
        shouldCloseOnInteractOutside,
        shouldCloseOnBlur,
        ...props
      } as AriaOverlayProps,
      // These are the only props needed
      { isOpen: !!isOpen, close: onClose } as OverlayTriggerState,
      ref as RefObject<HTMLElement>
    );

    const isCentered = align === 'center';

    return (
      <div ref={wrapperRef}>
        <Underlay {...underlayProps} isOpen={!!isOpen} />
        <StyledWrapper $isCentered={isCentered} $isOpen={!!isOpen}>
          <StyledModal $isOpen={isOpen} ref={ref} $isCentered={isCentered} {...mergeProps(modalProps, props)}>
            {children}
          </StyledModal>
        </StyledWrapper>
      </div>
    );
  }
);

ModalWrapper.displayName = 'ModalWrapper';

export { ModalWrapper };
export type { ModalWrapperProps };

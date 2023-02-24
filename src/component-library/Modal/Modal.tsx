import { forwardRef } from 'react';

import { Overlay } from '../Overlay';
import { Dialog, DialogProps } from './Dialog';
import { ModalWrapper, ModalWrapperProps } from './ModalWrapper';

type Props = {
  container?: Element;
  hasMaxHeight?: boolean;
  align?: 'top' | 'center';
};

type InheritAttrs = Omit<ModalWrapperProps & DialogProps, keyof Props>;

type ModalProps = Props & InheritAttrs;

const Modal = forwardRef<HTMLDivElement, ModalProps>(
  (
    { children, isDismissable = true, align = 'center', hasMaxHeight, isKeyboardDismissDisabled, container, ...props },
    ref
  ): JSX.Element | null => {
    const { isOpen, onClose } = props;

    return (
      <Overlay isOpen={isOpen} container={container}>
        <ModalWrapper
          ref={ref}
          align={align}
          isDismissable={isDismissable}
          isOpen={isOpen}
          isKeyboardDismissDisabled={isKeyboardDismissDisabled}
          onClose={onClose}
        >
          <Dialog hasMaxHeight={hasMaxHeight} align={align} {...props}>
            {children}
          </Dialog>
        </ModalWrapper>
      </Overlay>
    );
  }
);

Modal.displayName = 'Modal';

export { Modal };
export type { ModalProps };

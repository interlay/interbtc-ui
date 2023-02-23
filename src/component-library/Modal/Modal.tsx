import { forwardRef } from 'react';

import { Overlay } from '../Overlay';
import { ModalWrapper, ModalWrapperProps } from './ModalWrapper';

type Props = {
  container?: Element;
};

type InheritAttrs = Omit<ModalWrapperProps, keyof Props>;

type ModalProps = Props & InheritAttrs;

const Modal = forwardRef<HTMLDivElement, ModalProps>(({ children, isOpen, ...props }, ref): JSX.Element | null => {
  return (
    <Overlay isOpen={isOpen}>
      <ModalWrapper ref={ref} {...props}>
        {children}
      </ModalWrapper>
    </Overlay>
  );
});

Modal.displayName = 'Modal';

export { Modal };
export type { ModalProps };

import { MutableRefObject, ReactNode } from 'react';
import {
  ModalContent,
  ModalOverlay
} from './Modal.style';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  initialFocusRef?: MutableRefObject<HTMLElement | null> | undefined;
}

const Modal = ({
  open,
  onClose,
  children
//   initialFocusRef
}: ModalProps): JSX.Element => (
  open ?
    <ModalOverlay onClick={onClose}>
      <ModalContent>
        {children}
      </ModalContent>
    </ModalOverlay> :
    <></>
);

Modal.displayName = 'Modal';

export { Modal };
export type { ModalProps };

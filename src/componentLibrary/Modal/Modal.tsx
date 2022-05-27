import { MutableRefObject, ReactNode, useEffect } from 'react';
import { ModalContainer, ModalContent, ModalOverlay, CloseIcon } from './Modal.style';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  initialFocusRef?: MutableRefObject<HTMLElement | null>;
}

const Modal = ({ open, onClose, children, initialFocusRef }: ModalProps): JSX.Element => {
  useEffect(() => {
    if (initialFocusRef?.current) {
      initialFocusRef.current.focus();
    }
  }, [initialFocusRef]);

  // Closes modal on escape key.
  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.code === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeydown);
    return () => document.removeEventListener('keydown', handleKeydown);
  }, [onClose]);

  return open ? (
    <ModalContainer>
      <ModalOverlay onClick={onClose} />
      <ModalContent>
        <CloseIcon onClick={onClose} as='button'>
          x
        </CloseIcon>
        {children}
      </ModalContent>
    </ModalContainer>
  ) : (
    <></>
  );
};

Modal.displayName = 'Modal';

export { Modal };
export type { ModalProps };

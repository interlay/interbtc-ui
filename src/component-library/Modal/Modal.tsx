import { MutableRefObject, ReactNode, useEffect, useRef } from 'react';

import Portal from '@/parts/Portal';
import { useMountTransition } from '@/utils/hooks/use-mount-transition';

import { Icon } from '../Icon';
import { theme } from '../theme';
import { CloseIcon, ModalContainer, ModalContent, ModalOverlay } from './Modal.style';
interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  initialFocusRef?: MutableRefObject<HTMLElement | null>;
}

// TODO: we have missing relevant behaviours for a Modal. Could be rewritten with react-aria.
const Modal = ({ open, onClose, children, initialFocusRef }: ModalProps): JSX.Element | null => {
  const { shouldRender, transitionTrigger } = useMountTransition(open, theme.transition.duration.duration100);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // If initial element to be focused is not specified, close button is focused.
    if (initialFocusRef?.current) {
      initialFocusRef.current.focus();
    } else if (closeButtonRef?.current) {
      closeButtonRef.current.focus();
    }
  }, [initialFocusRef, closeButtonRef, shouldRender]);

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

  return open || shouldRender ? (
    <Portal>
      <ModalContainer role='dialog'>
        <ModalOverlay onClick={onClose} />
        <ModalContent transitionTrigger={transitionTrigger}>
          <CloseIcon aria-label='Dismiss' onClick={onClose} ref={closeButtonRef}>
            <Icon variant='close' />
          </CloseIcon>
          {children}
        </ModalContent>
      </ModalContainer>
    </Portal>
  ) : null;
};

Modal.displayName = 'Modal';

export { Modal };
export type { ModalProps };

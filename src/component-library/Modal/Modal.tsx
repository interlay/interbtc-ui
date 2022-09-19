import { AriaDialogProps, useDialog } from '@react-aria/dialog';
import { FocusScope } from '@react-aria/focus';
import { AriaOverlayProps, OverlayContainer, useModal, useOverlay, usePreventScroll } from '@react-aria/overlays';
import { ReactNode, useRef } from 'react';

import { useMountTransition } from '@/utils/hooks/use-mount-transition';

import { Icon } from '../Icon';
import { theme } from '../theme';
import { CloseIcon, Dialog, Title, Underlay } from './Modal.style';

type Props = {
  open: boolean;
  children: ReactNode;
  title?: ReactNode;
};

type InheritAttrs = Omit<AriaDialogProps & AriaOverlayProps, keyof Props>;

type ModalProps = Props & InheritAttrs;

const Modal = ({ title, children, ...props }: ModalProps): JSX.Element | null => {
  const { open, onClose } = props;
  const { shouldRender, transitionTrigger } = useMountTransition(open, theme.transition.duration);
  // Handle interacting outside the dialog and pressing
  // the Escape key to close the modal.
  const ref = useRef<HTMLDivElement>(null);
  const { overlayProps, underlayProps } = useOverlay(props, ref);

  // Prevent scrolling while the modal is open, and hide content
  // outside the modal from screen readers.
  usePreventScroll();
  const { modalProps } = useModal();

  // Get props for the dialog and its title
  const { dialogProps, titleProps } = useDialog(props, ref);

  return open || shouldRender ? (
    <OverlayContainer>
      <Underlay {...underlayProps}>
        <FocusScope contain restoreFocus autoFocus>
          <Dialog {...overlayProps} {...dialogProps} {...modalProps} $transitionTrigger={transitionTrigger} ref={ref}>
            <CloseIcon aria-label='Dismiss' onClick={onClose}>
              <Icon width='1.5em' height='1.5em' variant='close' />
            </CloseIcon>
            {title && <Title {...titleProps}>{title}</Title>}
            {children}
          </Dialog>
        </FocusScope>
      </Underlay>
    </OverlayContainer>
  ) : null;
};

Modal.displayName = 'Modal';

export { Modal };
export type { ModalProps };

import { AriaDialogProps, useDialog } from '@react-aria/dialog';
import { FocusScope } from '@react-aria/focus';
import { AriaOverlayProps, OverlayContainer, useModal, useOverlay, usePreventScroll } from '@react-aria/overlays';
import { forwardRef, ReactNode } from 'react';

import { useMountTransition } from '@/utils/hooks/use-mount-transition';

import { Icon } from '../Icon';
import { theme } from '../theme';
import { useDOMRef } from '../utils/dom';
import { NormalAlignments, Variants } from '../utils/prop-types';
import { StyledCloseCTA, StyledDialog, StyledHr, StyledTitle, StyledUnderlay } from './Modal.style';

type Props = {
  children: ReactNode;
  title?: ReactNode;
  titleVariant?: Exclude<Variants, 'outlined' | 'text'>;
  titleAlignment?: NormalAlignments;
};

type InheritAttrs = Omit<AriaDialogProps & AriaOverlayProps, keyof Props>;

type ModalProps = Props & InheritAttrs;

const Modal = forwardRef<HTMLDivElement, ModalProps>(
  (
    { title, children, titleVariant = 'primary', titleAlignment, isDismissable = true, ...props },
    ref
  ): JSX.Element | null => {
    const dialogRef = useDOMRef(ref);
    const { isOpen, onClose } = props;
    const { shouldRender, transitionTrigger } = useMountTransition(!!isOpen, theme.transition.duration);

    // Handle interacting outside the dialog and pressing
    // the Escape key to close the modal.
    const { overlayProps, underlayProps } = useOverlay({ isDismissable, ...props }, dialogRef);

    // Prevent scrolling while the modal is open, and hide content
    // outside the modal from screen readers.
    usePreventScroll();
    const { modalProps } = useModal();

    // Get props for the dialog and its title
    const { dialogProps, titleProps } = useDialog(props, dialogRef);

    return isOpen || shouldRender ? (
      <OverlayContainer>
        <StyledUnderlay {...underlayProps}>
          <FocusScope contain restoreFocus autoFocus>
            <StyledDialog
              $transitionTrigger={transitionTrigger}
              ref={dialogRef}
              {...overlayProps}
              {...dialogProps}
              {...modalProps}
            >
              {title && (
                <>
                  <StyledTitle $variant={titleVariant} $alignment={titleAlignment} {...titleProps}>
                    {title}
                  </StyledTitle>
                  {titleVariant === 'secondary' && <StyledHr />}
                </>
              )}
              <StyledCloseCTA size='small' variant='text' aria-label='Dismiss' onClick={onClose}>
                <Icon width='1.5em' height='1.5em' variant='close' />
              </StyledCloseCTA>
              {children}
            </StyledDialog>
          </FocusScope>
        </StyledUnderlay>
      </OverlayContainer>
    ) : null;
  }
);

Modal.displayName = 'Modal';

export { Modal };
export type { ModalProps };

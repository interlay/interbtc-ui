import { AriaDialogProps, useDialog } from '@react-aria/dialog';
import { AriaOverlayProps } from '@react-aria/overlays';
import { forwardRef, ReactNode } from 'react';

import { XMark } from '@/assets/icons';

import { useDOMRef } from '../utils/dom';
import { StyledCloseCTA, StyledDialog } from './Modal.style';
import { ModalContext } from './ModalContext';

type Props = {
  children: ReactNode;
  align?: 'top' | 'center';
  hasMaxHeight?: boolean;
};

type InheritAttrs = Omit<AriaDialogProps & AriaOverlayProps, keyof Props>;

type ModalWrapperProps = Props & InheritAttrs;

const ModalWrapper = forwardRef<HTMLDivElement, ModalWrapperProps>(
  ({ children, align = 'center', hasMaxHeight, onClose, ...props }, ref): JSX.Element | null => {
    const dialogRef = useDOMRef(ref);

    // Get props for the dialog and its title
    const { dialogProps, titleProps } = useDialog(props, dialogRef);

    const isCentered = align === 'center';

    return (
      <ModalContext.Provider value={{ titleProps, bodyProps: { overflow: isCentered ? 'auto' : undefined } }}>
        <StyledDialog $isCentered={isCentered} $hasMaxHeight={hasMaxHeight} {...dialogProps}>
          <StyledCloseCTA size='small' variant='text' aria-label='Dismiss' onPress={onClose}>
            <XMark />
          </StyledCloseCTA>
          {children}
        </StyledDialog>
      </ModalContext.Provider>
    );
  }
);

ModalWrapper.displayName = 'ModalWrapper';

export { ModalWrapper };
export type { ModalWrapperProps };

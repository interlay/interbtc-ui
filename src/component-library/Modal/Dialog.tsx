import { AriaDialogProps, useDialog } from '@react-aria/dialog';
import { forwardRef, ReactNode } from 'react';

import { XMark } from '@/assets/icons';

import { useDOMRef } from '../utils/dom';
import { StyledCloseCTA, StyledDialog } from './Modal.style';
import { ModalContext } from './ModalContext';

type Props = {
  children: ReactNode;
  align?: 'top' | 'center';
  hasMaxHeight?: boolean;
  onClose: () => void;
};

type InheritAttrs = Omit<AriaDialogProps, keyof Props>;

type DialogProps = Props & InheritAttrs;

const Dialog = forwardRef<HTMLDivElement, DialogProps>(
  ({ children, align = 'center', hasMaxHeight, onClose, ...props }, ref): JSX.Element | null => {
    const dialogRef = useDOMRef(ref);

    // Get props for the dialog and its title
    const { dialogProps, titleProps } = useDialog(props, dialogRef);

    const isCentered = align === 'center';

    return (
      <ModalContext.Provider value={{ titleProps, bodyProps: { overflow: isCentered ? 'auto' : undefined } }}>
        <StyledDialog ref={dialogRef} $isCentered={isCentered} $hasMaxHeight={hasMaxHeight} {...dialogProps}>
          <StyledCloseCTA size='small' variant='text' aria-label='Dismiss' onPress={onClose}>
            <XMark />
          </StyledCloseCTA>
          {children}
        </StyledDialog>
      </ModalContext.Provider>
    );
  }
);

Dialog.displayName = 'Dialog';

export { Dialog };
export type { DialogProps };

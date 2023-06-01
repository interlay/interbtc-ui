import { AriaDialogProps, useDialog } from '@react-aria/dialog';
import { mergeProps } from '@react-aria/utils';
import { PressEvent } from '@react-types/shared';
import { forwardRef, ReactNode } from 'react';

import { XMark } from '@/assets/icons';

import { useDOMRef } from '../utils/dom';
import { CTASizes, Sizes } from '../utils/prop-types';
import { StyledCloseCTA, StyledDialog } from './Dialog.style';
import { DialogContext } from './DialogContext';

const closeCTASizeMap: Record<Sizes, CTASizes> = { small: 'x-small', medium: 'small', large: 'small' };

type Props = {
  children?: ReactNode;
  onClose?: (e: PressEvent) => void;
  size?: Sizes;
};

type InheritAttrs = Omit<AriaDialogProps, keyof Props>;

type DialogProps = Props & InheritAttrs;

const Dialog = forwardRef<HTMLDivElement, DialogProps>(
  ({ children, onClose, size = 'medium', ...props }, ref): JSX.Element => {
    const dialogRef = useDOMRef(ref);

    // Get props for the dialog and its title
    const { dialogProps, titleProps } = useDialog(props, dialogRef);

    const closeCTASize = closeCTASizeMap[size];

    return (
      <DialogContext.Provider value={{ titleProps, size }}>
        <StyledDialog ref={dialogRef} $size={size} {...mergeProps(props, dialogProps)}>
          {onClose && (
            <StyledCloseCTA size={closeCTASize} variant='text' aria-label='Dismiss' onPress={onClose}>
              <XMark />
            </StyledCloseCTA>
          )}
          {children}
        </StyledDialog>
      </DialogContext.Provider>
    );
  }
);

Dialog.displayName = 'Dialog';

export { Dialog };
export type { DialogProps };

import clsx from 'clsx';
import * as React from 'react';

import { ReactComponent as SpinIcon } from '@/assets/img/icons/spin.svg';
import InterlayButtonBase, { Props as InterlayButtonBaseProps } from '@/legacy-components/UI/InterlayButtonBase';
import { BORDER_CLASSES, DISABLED_BORDER_CLASSES, DISABLED_TEXT_CLASSES, TEXT_CLASSES } from '@/utils/constants/styles';

interface CustomProps {
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  pending?: boolean;
}

type Ref = HTMLButtonElement;
const InterlayDefaultOutlinedButton = React.forwardRef<Ref, Props>(
  ({ className, children, startIcon, endIcon, disabled = false, pending = false, ...rest }, ref): JSX.Element => {
    const disabledOrPending = disabled || pending;

    return (
      <InterlayButtonBase
        ref={ref}
        type='button'
        className={clsx(
          'focus:outline-none',
          'focus:ring',
          'focus:border-interlayPaleSky-300',
          'focus:ring-interlayPaleSky-200',
          'focus:ring-opacity-50',

          disabledOrPending
            ? clsx(DISABLED_BORDER_CLASSES, DISABLED_TEXT_CLASSES)
            : clsx(
                TEXT_CLASSES,
                'hover:bg-black',
                'hover:bg-opacity-5',
                'dark:hover:bg-white',
                'dark:hover:bg-opacity-10',

                BORDER_CLASSES
              ),

          'font-medium',
          'rounded',
          'px-4',
          'py-2',
          'text-sm',
          'space-x-1',
          'justify-center',
          className
        )}
        disabled={disabledOrPending}
        {...rest}
      >
        {pending && <SpinIcon className={clsx('animate-spin', 'w-4', 'h-4', 'mr-3')} />}
        {startIcon}
        <span>{children}</span>
        {endIcon}
      </InterlayButtonBase>
    );
  }
);
InterlayDefaultOutlinedButton.displayName = 'InterlayDefaultOutlinedButton';

export type Props = CustomProps & InterlayButtonBaseProps;

export default InterlayDefaultOutlinedButton;

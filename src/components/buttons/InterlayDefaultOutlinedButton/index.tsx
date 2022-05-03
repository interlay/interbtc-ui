
import * as React from 'react';
import clsx from 'clsx';

import InterlayButtonBase, { Props as InterlayButtonBaseProps } from 'components/UI/InterlayButtonBase';
import { LIGHT_DARK_BORDER_CLASSES } from 'utils/constants/styles';
import { ReactComponent as SpinIcon } from 'assets/img/icons/spin.svg';

interface CustomProps {
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  pending?: boolean;
}

type Ref = HTMLButtonElement;
const InterlayDefaultOutlinedButton = React.forwardRef<Ref, Props>(({
  className,
  children,
  startIcon,
  endIcon,
  disabled = false,
  pending = false,
  ...rest
}, ref): JSX.Element => {
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

        disabledOrPending ? clsx(
          // ray test touch <
          // TODO: could be reused
          'border',
          'border-black',
          'border-opacity-10',
          'dark:border-white',
          'dark:border-opacity-10',
          // ray test touch >
          // ray test touch <
          'text-black',
          'text-opacity-25',
          'dark:text-white',
          'dark:text-opacity-30'
          // ray test touch >
        ) : clsx(
          // ray test touch <
          'text-black',
          'text-opacity-90',
          'dark:text-white',
          'hover:bg-black',
          'hover:bg-opacity-5',
          'dark:hover:bg-white',
          'dark:hover:bg-opacity-10',
          // ray test touch >

          LIGHT_DARK_BORDER_CLASSES
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
      {...rest}>
      {pending && (
        <SpinIcon
          className={clsx(
            'animate-spin',
            'w-4',
            'h-4',
            'mr-3'
          )} />
      )}
      {startIcon}
      <span>
        {children}
      </span>
      {endIcon}
    </InterlayButtonBase>
  );
});
InterlayDefaultOutlinedButton.displayName = 'InterlayDefaultOutlinedButton';

export type Props = CustomProps & InterlayButtonBaseProps;

export default InterlayDefaultOutlinedButton;


import * as React from 'react';
import clsx from 'clsx';

import InterlayButtonBase, { Props as InterlayButtonBaseProps } from 'components/UI/InterlayButtonBase';
import { ReactComponent as SpinIcon } from 'assets/img/icons/spin.svg';

interface CustomProps {
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  pending?: boolean;
}

type Ref = HTMLButtonElement;
const InterlayRoseContainedButton = React.forwardRef<Ref, Props>(({
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
        'focus:border-interlayRose-300',
        'focus:ring-interlayRose-200',
        'focus:ring-opacity-50',

        'border',
        'border-transparent',
        'font-medium',

        disabledOrPending ? clsx(
          'bg-black',
          'bg-opacity-10',
          'text-black',
          'text-opacity-25'
        ) : clsx(
          'text-white',
          'bg-interlayRose',
          'hover:bg-interlayRose-600'
        ),

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
InterlayRoseContainedButton.displayName = 'InterlayRoseContainedButton';

export type Props = CustomProps & InterlayButtonBaseProps;

export default InterlayRoseContainedButton;

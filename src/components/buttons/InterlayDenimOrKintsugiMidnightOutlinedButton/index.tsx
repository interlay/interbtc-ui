
import * as React from 'react';
import clsx from 'clsx';

import InterlayButtonBase, { Props as InterlayButtonBaseProps } from 'components/UI/InterlayButtonBase';
import {
  POLKADOT,
  KUSAMA
} from 'utils/constants/relay-chain-names';
import {
  DISABLED_BORDER_CLASSES,
  DISABLED_TEXT_CLASSES
} from 'utils/constants/styles';
import { ReactComponent as SpinIcon } from 'assets/img/icons/spin.svg';

interface CustomProps {
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  pending?: boolean;
}

type Ref = HTMLButtonElement;
const InterlayDenimOrKintsugiMidnightOutlinedButton = React.forwardRef<Ref, Props>(({
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
        {
          [clsx(
            'focus:border-interlayDenim-300',
            'focus:ring-interlayDenim-200'
          )]: process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT
        },
        {
          [clsx(
            'dark:focus:border-kintsugiSupernova-300',
            'dark:focus:ring-kintsugiSupernova-200'
          )]: process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA
        },
        'focus:ring-opacity-50',

        'font-medium',

        disabledOrPending ? clsx(
          DISABLED_BORDER_CLASSES,
          DISABLED_TEXT_CLASSES
        ) : clsx(
          'border',
          {
            [clsx(
              'text-interlayDenim',
              'border-interlayDenim',
              'hover:bg-interlayDenim',
              'hover:bg-opacity-5'
            )]: process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT
          },
          {
            [clsx(
              'text-kintsugiSupernova',
              'dark:border-kintsugiSupernova',
              'dark:hover:bg-kintsugiSupernova',
              'dark:hover:bg-opacity-5'
            )]: process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA
          }
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
InterlayDenimOrKintsugiMidnightOutlinedButton.displayName = 'InterlayDenimOrKintsugiMidnightOutlinedButton';

export type Props = CustomProps & InterlayButtonBaseProps;

export default InterlayDenimOrKintsugiMidnightOutlinedButton;

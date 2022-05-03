
import * as React from 'react';
import clsx from 'clsx';

import InterlayButtonBase, { Props as InterlayButtonBaseProps } from 'components/UI/InterlayButtonBase';
import {
  POLKADOT,
  KUSAMA
} from 'utils/constants/relay-chain-names';
import {
  DISABLED_BACKGROUND_CLASSES,
  DISABLED_TEXT_CLASSES
} from 'utils/constants/styles';
import { ReactComponent as SpinIcon } from 'assets/img/icons/spin.svg';

interface CustomProps {
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  pending?: boolean;
}

type Ref = HTMLButtonElement;
const InterlayDenimOrKintsugiSupernovaContainedButton = React.forwardRef<Ref, Props>(({
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

        'border',
        'border-transparent',
        'font-medium',

        disabledOrPending ? clsx(
          DISABLED_BACKGROUND_CLASSES,
          DISABLED_TEXT_CLASSES
        ) : clsx(
          {
            [clsx(
              'text-white',
              'bg-interlayDenim',
              'hover:bg-interlayDenim-600'
            )]: process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT
          },
          {
            [clsx(
              'text-mineShaft',
              'dark:bg-kintsugiSupernova',
              'dark:hover:bg-kintsugiSupernova-600'
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
InterlayDenimOrKintsugiSupernovaContainedButton.displayName = 'InterlayDenimOrKintsugiSupernovaContainedButton';

export type Props = CustomProps & InterlayButtonBaseProps;

export default InterlayDenimOrKintsugiSupernovaContainedButton;

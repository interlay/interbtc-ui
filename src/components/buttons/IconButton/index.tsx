import * as React from 'react';
import clsx from 'clsx';

import InterlayButtonBase, { Props as InterlayButtonBaseProps } from 'components/UI/InterlayButtonBase';
import { POLKADOT, KUSAMA } from 'utils/constants/relay-chain-names';
import { ReactComponent as SpinIcon } from 'assets/img/icons/spin.svg';

type CustomProps = {
  pending?: boolean;
};

type Ref = HTMLButtonElement;
const IconButton = React.forwardRef<Ref, Props>(
  ({ children, disabled = false, pending = false, className, ...rest }, ref): JSX.Element => {
    const disabledOrPending = disabled || pending;

    return (
      <InterlayButtonBase
        ref={ref}
        className={clsx(
          'focus:outline-none',
          'focus:ring',
          { 'focus:border-interlayDenim-300': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
          { 'focus:ring-interlayDenim-200': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
          { 'dark:focus:border-kintsugiMidnight-300': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
          { 'dark:focus:ring-kintsugiMidnight-200': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
          'focus:ring-opacity-50',

          'rounded-full',
          'justify-center',
          'hover:bg-black',
          'hover:bg-opacity-5',
          className
        )}
        disabled={disabledOrPending}
        {...rest}
      >
        {pending ? <SpinIcon className={clsx('animate-spin', 'w-5', 'h-5')} /> : children}
      </InterlayButtonBase>
    );
  }
);
IconButton.displayName = 'IconButton';

export type Props = CustomProps & InterlayButtonBaseProps;

export default IconButton;

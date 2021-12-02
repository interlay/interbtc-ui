
import * as React from 'react';
import clsx from 'clsx';

import {
  POLKADOT,
  KUSAMA
} from 'utils/constants/relay-chain-names';
import styles from './interlay-input.module.css';

type Ref = HTMLInputElement;
const InterlayInput = React.forwardRef<Ref, Props>(({
  className,
  ...rest
}: Props, ref): JSX.Element => (
  <input
    ref={ref}
    type='text'
    className={clsx(
      styles.interlayInput,
      'focus:ring',
      { 'focus:border-interlayDenim-300':
        process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
      { 'focus:ring-interlayDenim-200':
        process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
      { 'dark:focus:border-kintsugiMidnight-300': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
      { 'dark:focus:ring-kintsugiMidnight-200': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
      'focus:ring-opacity-50',
      'text-black',
      'text-opacity-90',
      'dark:text-white',
      'bg-white',
      { 'dark:bg-kintsugiMidnight': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
      'block',
      'w-full',
      'text-base',

      // TODO: could be reused
      // MEMO: inspired by https://mui.com/components/buttons/
      'border-black',
      'border-opacity-25',
      'dark:border-white',
      'dark:border-opacity-25',

      'shadow-sm',
      'rounded-md',
      'placeholder-gray-400',
      className
    )}
    {...rest} />
));
InterlayInput.displayName = 'InterlayInput';

export type Props = React.ComponentPropsWithRef<'input'>;

export default InterlayInput;

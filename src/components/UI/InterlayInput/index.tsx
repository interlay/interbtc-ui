import clsx from 'clsx';
import * as React from 'react';

import { KUSAMA, POLKADOT } from '@/utils/constants/relay-chain-names';
import { BORDER_CLASSES, TEXT_CLASSES } from '@/utils/constants/styles';

import styles from './interlay-input.module.css';

const InterlayInput = React.forwardRef<HTMLInputElement, Props>(
  ({ className, ...rest }, ref): JSX.Element => (
    <input
      ref={ref}
      type='text'
      className={clsx(
        styles.interlayInput,
        'focus:ring',
        { 'focus:border-interlayDenim-300': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
        { 'focus:ring-interlayDenim-200': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
        { 'dark:focus:border-kintsugiMidnight-300': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
        { 'dark:focus:ring-kintsugiMidnight-200': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
        'focus:ring-opacity-50',
        TEXT_CLASSES,
        'bg-white',
        { 'dark:bg-kintsugiMidnight': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
        'block',
        'w-full',
        'text-base',

        BORDER_CLASSES,

        'shadow-sm',
        'rounded-md',
        'placeholder-gray-400',
        className
      )}
      {...rest}
    />
  )
);
InterlayInput.displayName = 'InterlayInput';

export type Props = React.ComponentPropsWithRef<'input'>;

export default InterlayInput;


import * as React from 'react';
import clsx from 'clsx';

import {
  POLKADOT,
  KUSAMA
} from 'utils/constants/relay-chain-names';
// ray test touch <<
import { LIGHT_DARK_BORDER_CLASSES } from 'utils/constants/styles';
// ray test touch >>
import styles from './interlay-input.module.css';

type Ref = HTMLInputElement;
const InterlayInput = React.forwardRef<Ref, Props>(({
  className,
  ...rest
}, ref): JSX.Element => (
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

      // ray test touch <<
      LIGHT_DARK_BORDER_CLASSES,
      // ray test touch >>

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

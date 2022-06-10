import clsx from 'clsx';
import * as React from 'react';

import { KUSAMA,POLKADOT } from '@/utils/constants/relay-chain-names';

import styles from './checkbox-input.module.css';

enum CheckboxLabelSide {
  RIGHT = 'right',
  LEFT = 'left'
}
interface CheckboxCustomProps {
  label?: JSX.Element | string;
  error?: boolean;
  labelSide?: CheckboxLabelSide;
  required?: boolean;
}

type Ref = HTMLInputElement;

const Checkbox = React.forwardRef<Ref, Props>(
  ({ id, label, labelSide = CheckboxLabelSide.RIGHT, error, required, ...rest }, ref): JSX.Element => (
    <div className={clsx('flex', 'items-center', 'space-x-2', { 'flex-row-reverse': labelSide === 'right' })}>
      {label && (
        <CheckboxLabel
          htmlFor={id}
          required={required}
          className={clsx(
            'text-base',
            'opacity-90',
            { 'text-interlayTextSecondaryInLightMode': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
            { 'dark:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
            {
              [clsx(
                { 'text-interlayCinnabar': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
                { 'text-kintsugiThunderbird': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
              )]: error
            }
          )}
        >
          {label}
        </CheckboxLabel>
      )}
      <CheckboxInput
        ref={ref}
        id={id}
        type='checkbox'
        className={clsx({
          [clsx(
            { 'border-interlayCinnabar': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
            { 'dark:border-kintsugiThunderbird': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
            { 'text-interlayCinnabar': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
            { 'text-kintsugiThunderbird': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
          )]: error
        })}
        {...rest}
      />
    </div>
  )
);
Checkbox.displayName = 'Checkbox';

interface CheckboxLabelCustomProps {
  required?: boolean;
}

const CheckboxLabel = ({
  children,
  required,
  className,
  ...rest
}: CheckboxLabelCustomProps & React.ComponentPropsWithRef<'label'>): JSX.Element => (
  <label className={clsx('text-sm', 'space-x-0.5', className)} {...rest}>
    <span>{children}</span>
    {required && <span>*</span>}
  </label>
);

const CheckboxInput = React.forwardRef<Ref, CheckboxInputProps>(
  ({ className, type = 'text', disabled, ...rest }, ref): JSX.Element => (
    <input
      ref={ref}
      type={type}
      disabled={disabled}
      className={clsx(
        { [styles.checkmarkGray]: process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
        { 'focus:border-interlayDenim-300': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
        { 'dark:focus:border-kintsugiMidnight-300': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
        'focus:ring-0',
        'bg-white',
        { 'text-interlayDenim': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
        { 'dark:text-kintsugiSupernova': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
        'rounded-sm',
        { 'opacity-50': disabled },
        { 'cursor-not-allowed': disabled },
        className
      )}
      {...rest}
    />
  )
);
CheckboxInput.displayName = 'CheckboxInput';

type CheckboxInputProps = React.ComponentPropsWithRef<'input'>;

export { CheckboxInput, CheckboxLabel, CheckboxLabelSide };

export type Props = CheckboxCustomProps & CheckboxInputProps;

export default Checkbox;

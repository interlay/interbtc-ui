
import * as React from 'react';
import clsx from 'clsx';
import {
  POLKADOT,
  KUSAMA
} from 'utils/constants/relay-chain-names';
import styles from './checkbox-input.module.css';

interface CustomCheckboxProps {
  label?: JSX.Element | string;
  error?: boolean;
  labelSide?: 'right' | 'left';
  required?: boolean;
}

type Ref = HTMLInputElement;

const Checkbox = React.forwardRef<Ref, Props>(({
  id,
  label,
  labelSide = 'right',
  error,
  required,
  ...rest
}, ref): JSX.Element => (
  <CheckboxContainer
    className={clsx(
      'flex',
      'space-x-0.5',
      'items-center',
      { 'flex-row-reverse': labelSide === 'right' })}>
    {label && (
      <CheckboxLabel
        htmlFor={id}
        required={required}
        className={clsx(
          'text-base',
          'opacity-90',
          labelSide === 'right' ? 'ml-2' : 'mr-2',
          { 'text-interlayTextSecondaryInLightMode': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
          { 'dark:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
          { [clsx(
            { 'text-interlayCinnabar': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
            { 'text-kintsugiThunderbird': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
          )]: error
          }
        )}>
        {label}
      </CheckboxLabel>
    )}
    <CheckboxInput
      ref={ref}
      id={id}
      type='checkbox'
      className={clsx(
        {
          [clsx(
            { 'border-interlayCinnabar': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
            { 'dark:border-kintsugiThunderbird': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
            { 'text-interlayCinnabar': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
            { 'text-kintsugiThunderbird': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
          )]: error
        }
      )}
      {...rest} />
  </CheckboxContainer>
));
Checkbox.displayName = 'Checkbox';

const CheckboxContainer = (props: React.ComponentPropsWithRef<'div'>): JSX.Element => (
  <div {...props} />
);

interface CustomTextFieldLabelProps {
  required?: boolean;
}

const CheckboxLabel = ({
  children,
  required,
  className,
  ...rest
}: CustomTextFieldLabelProps & React.ComponentPropsWithRef<'label'>): JSX.Element => (
  <label
    className={clsx(
      'text-sm',
      'space-x-0.5',
      className
    )}
    {...rest}>
    <span>{children}</span>
    {required && <span>*</span>}
  </label>
);

const CheckboxInput = React.forwardRef<Ref, CheckboxInputProps>(({
  className,
  type = 'text',
  disabled,
  ...rest
}, ref): JSX.Element => (
  <input
    ref={ref}
    type={type}
    disabled={disabled}
    className={clsx(
      { [styles.checkmarkGray]: process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
      { 'focus:border-interlayDenim-300':
        process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
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
    {...rest} />
));
CheckboxInput.displayName = 'CheckboxInput';

type CheckboxInputProps = React.ComponentPropsWithRef<'input'>;

export {
  CheckboxInput,
  CheckboxLabel,
  CheckboxContainer
};

export type Props = CustomCheckboxProps & CheckboxInputProps;

export default Checkbox;

import clsx from 'clsx';
import * as React from 'react';

import InterlayInput, { Props as InterlayInputProps } from '@/components/UI/InterlayInput';
import { KUSAMA,POLKADOT } from '@/utils/constants/relay-chain-names';

interface CustomTextFieldProps {
  label?: JSX.Element | string;
  error?: boolean;
  helperText?: JSX.Element | string;
  required?: boolean;
}

type Ref = HTMLInputElement;

const TextField = React.forwardRef<Ref, Props>(
  ({ id, label, error, helperText, required, ...rest }, ref): JSX.Element => (
    <TextFieldContainer className='space-y-0.5'>
      {label && (
        <TextFieldLabel
          htmlFor={id}
          required={required}
          className={clsx({
            [clsx(
              { 'text-interlayCinnabar': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
              { 'text-kintsugiThunderbird': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
            )]: error
          })}
        >
          {label}
        </TextFieldLabel>
      )}
      <InterlayInput
        ref={ref}
        id={id}
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
      <TextFieldHelperText
        className={clsx(
          {
            [clsx(
              { 'text-interlayCinnabar': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
              { 'text-kintsugiThunderbird': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
            )]: error
          },
          'h-6'
        )}
      >
        {helperText}
      </TextFieldHelperText>
    </TextFieldContainer>
  )
);
TextField.displayName = 'TextField';

const TextFieldContainer = (props: React.ComponentPropsWithRef<'div'>): JSX.Element => <div {...props} />;

interface CustomTextFieldLabelProps {
  required?: boolean;
}

const TextFieldLabel = ({
  children,
  required,
  className,
  ...rest
}: CustomTextFieldLabelProps & React.ComponentPropsWithRef<'label'>): JSX.Element => (
  <label className={clsx('text-sm', 'space-x-0.5', className)} {...rest}>
    <span>{children}</span>
    {required && <span>*</span>}
  </label>
);

const TextFieldHelperText = ({ className, ...rest }: React.ComponentPropsWithRef<'p'>): JSX.Element => (
  <p className={clsx('text-sm', className)} {...rest} />
);

export { TextFieldContainer,TextFieldHelperText, TextFieldLabel };

export type Props = CustomTextFieldProps & InterlayInputProps;

export default TextField;

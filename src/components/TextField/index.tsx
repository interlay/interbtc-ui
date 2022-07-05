import * as React from 'react';
import clsx from 'clsx';

import InterlayInput, { Props as InterlayInputProps } from 'components/UI/InterlayInput';
import { POLKADOT, KUSAMA } from 'utils/constants/relay-chain-names';

interface TextFieldCustomProps {
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

interface TextFieldLabelCustomProps {
  required?: boolean;
}

const TextFieldLabel = ({
  children,
  required,
  className,
  ...rest
}: TextFieldLabelCustomProps & React.ComponentPropsWithRef<'label'>): JSX.Element => (
  <label className={clsx('text-sm', 'space-x-0.5', className)} {...rest}>
    <span>{children}</span>
    {required && <span>*</span>}
  </label>
);

const TextFieldHelperText = ({ className, ...rest }: React.ComponentPropsWithRef<'p'>): JSX.Element => (
  <p className={clsx('text-sm', className)} {...rest} />
);

export { TextFieldLabel, TextFieldHelperText, TextFieldContainer };

export type Props = TextFieldCustomProps & InterlayInputProps;

export default TextField;

import clsx from 'clsx';
import * as React from 'react';

import { KUSAMA, POLKADOT } from '@/utils/constants/relay-chain-names';

import NumberInput, { Props as NumberInputProps } from '../NumberInput';
import { TextFieldContainer, TextFieldHelperText, TextFieldLabel } from '../TextField';

interface CustomProps {
  label: string;
  error?: boolean;
  helperText?: JSX.Element | string;
  required?: boolean;
  approxUSD: string;
}

const TokenField = React.forwardRef<HTMLInputElement, Props>(
  ({ id, label, error, helperText, required, approxUSD, ...rest }, ref): JSX.Element => {
    return (
      <div className='space-y-1.5'>
        <TextFieldContainer className='relative'>
          <NumberInput
            ref={ref}
            id={id}
            className={clsx('text-5xl', 'pr-36', {
              [clsx(
                { 'border-interlayCinnabar': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
                { 'dark:border-kintsugiThunderbird': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
                { 'text-interlayCinnabar': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
                { 'text-kintsugiThunderbird': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
              )]: error
            })}
            {...rest}
          />
          <TextFieldLabel
            className={clsx('text-2xl', 'text-gray-400', 'font-medium', 'absolute', 'right-4', 'top-2')}
            required={required}
          >
            {label}
          </TextFieldLabel>
          <span
            className={clsx(
              'block',
              'text-xl',
              { 'text-interlayTextSecondaryInLightMode': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
              { 'dark:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
              'text-right',
              'absolute',
              'right-4',
              'bottom-2'
            )}
          >
            {approxUSD}
          </span>
        </TextFieldContainer>
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
      </div>
    );
  }
);
TokenField.displayName = 'TokenField';

export type Props = CustomProps & NumberInputProps;

export default TokenField;

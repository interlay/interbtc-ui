import clsx from 'clsx';
import * as React from 'react';

import NumberInput, { Props as NumberInputProps } from '@/legacy-components/NumberInput';
import { TextFieldContainer, TextFieldHelperText, TextFieldLabel } from '@/legacy-components/TextField';
import { KUSAMA, POLKADOT } from '@/utils/constants/relay-chain-names';

interface CustomProps {
  error?: boolean;
  helperText?: JSX.Element | string;
  required?: boolean;
  approxUSD?: string;
}

type Ref = HTMLInputElement;
const TokenAmountField = React.forwardRef<Ref, CustomProps & NumberInputProps>(
  ({ id, error, helperText, required, approxUSD, ...rest }, ref): JSX.Element => {
    return (
      <div className={clsx('flex-1')}>
        <TextFieldContainer className='relative'>
          <NumberInput
            ref={ref}
            id={id}
            className={clsx('text-5xl', 'text-right', {
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
          ></TextFieldLabel>
          <span
            className={clsx(
              'block',
              'text-5xl',
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

TokenAmountField.displayName = 'TokenAmountField';

export default TokenAmountField;

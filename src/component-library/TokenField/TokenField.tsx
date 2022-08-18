import * as React from 'react';

import { formatUSD } from '@/common/utils/utils';

import { NumberInputProps } from '../NumberInput';
import { Stack } from '../Stack';
import { TokenBalance } from '../TokenBalance';
import {
  TokenAdornment,
  TokenFieldInnerWrapper,
  TokenFieldInput,
  TokenFieldSymbol,
  TokenFieldUSD
} from './TokenField.style';

interface TokenFieldProps extends NumberInputProps {
  balance?: {
    value: number;
    valueInUSD: number;
  };
  tokenSymbol: string;
  valueInUSD: number;
}

const TokenField = React.forwardRef<HTMLInputElement, TokenFieldProps>(
  ({ tokenSymbol, valueInUSD, balance, ...rest }, ref): JSX.Element => {
    const endAdornment = (
      <TokenAdornment>
        <TokenFieldSymbol>{tokenSymbol}</TokenFieldSymbol>
        <TokenFieldUSD>{`≈ ${formatUSD(valueInUSD)}`}</TokenFieldUSD>
      </TokenAdornment>
    );

    return (
      <Stack spacing='half'>
        {balance ? (
          <TokenBalance tokenSymbol={tokenSymbol} value={balance.value} valueInUSD={balance.valueInUSD} />
        ) : null}
        <TokenFieldInnerWrapper>
          <TokenFieldInput ref={ref} endAdornment={endAdornment} {...rest} />
        </TokenFieldInnerWrapper>
      </Stack>
    );
  }
);
TokenField.displayName = 'TokenField';

export { TokenField };
export type { TokenFieldProps };

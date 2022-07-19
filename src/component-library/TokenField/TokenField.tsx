import * as React from 'react';

import { NumberInputProps } from '../NumberInput';
import { Stack } from '../Stack';
import { TokenBalance } from '../TokenBalance';
import { TokenFieldInnerWrapper, TokenFieldInput, TokenFieldSymbol, TokenFieldUSD } from './TokenField.style';

interface TokenFieldProps extends NumberInputProps {
  balance?: {
    value: string;
    valueInUSD: string;
  };
  tokenSymbol: string;
  valueInUSD: string;
}

const TokenField = React.forwardRef<HTMLInputElement, TokenFieldProps>(
  ({ tokenSymbol, valueInUSD, balance, ...rest }, ref): JSX.Element => {
    return (
      <Stack spacing='half'>
        {balance ? (
          <TokenBalance tokenSymbol={tokenSymbol} value={balance.value} valueInUSD={balance.valueInUSD} />
        ) : null}
        <TokenFieldInnerWrapper>
          <TokenFieldInput ref={ref} {...rest} />
          <TokenFieldSymbol>{tokenSymbol}</TokenFieldSymbol>
          <TokenFieldUSD>{`≈ $ ${valueInUSD}`}</TokenFieldUSD>
        </TokenFieldInnerWrapper>
      </Stack>
    );
  }
);
TokenField.displayName = 'TokenField';

export { TokenField };
export type { TokenFieldProps };

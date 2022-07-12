import * as React from 'react';

import { TokenFieldInnerWrapper, TokenFieldSymbol, TokenFieldInput, TokenFieldUSD } from './TokenField.style';
import { NumberInputProps } from 'component-library/NumberInput';
import { TokenBalance } from 'component-library/TokenBalance';
import { Stack } from 'component-library/Stack';

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

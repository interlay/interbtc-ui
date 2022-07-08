import * as React from 'react';

import { TokenFieldWrapper, TokenFieldInnerWrapper, TokenFieldSymbol, TokenFieldInput, TokenFieldUSD } from './TokenField.style';
import { NumberInputProps } from 'component-library/NumberInput';
import { TokenBalance } from 'component-library/TokenBalance';

interface TokenFieldProps extends NumberInputProps {
  balance?: string;
  tokenSymbol: string;
  valueInUSD: string;
}

const TokenField = React.forwardRef<HTMLInputElement, TokenFieldProps>(
  ({ tokenSymbol, valueInUSD, balance, ...rest }, ref): JSX.Element => {

    return (
      <TokenFieldWrapper>
        {balance && (
          // TODO: replace `valueInUSD` value with the balance value in USD according to the underlying token symbol
          <TokenBalance tokenSymbol={tokenSymbol} value={balance} valueInUSD={`${balance}00`} />
        )}
        <TokenFieldInnerWrapper>
          <TokenFieldInput ref={ref} {...rest} />
          <TokenFieldSymbol>{tokenSymbol}</TokenFieldSymbol>
          <TokenFieldUSD>{`≈ $ ${valueInUSD}`}</TokenFieldUSD>
        </TokenFieldInnerWrapper>
      </TokenFieldWrapper>
    );
  }
);
TokenField.displayName = 'TokenField';

export { TokenField };
export type { TokenFieldProps };

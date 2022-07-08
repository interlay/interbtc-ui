import * as React from 'react';

import { TokenFieldWithBalanceWrapper, TokenFieldWrapper, TokenFieldSymbol, TokenFieldInput, TokenFieldUSD } from './TokenFieldWithBalance.style';
import { NumberInputProps } from 'component-library/NumberInput';
import { TokenBalance } from 'component-library/TokenBalance';

interface TokenFieldWithBalanceProps extends NumberInputProps {
  balance?: string;
  tokenSymbol: string;
  valueInUSD: string;
}

const TokenFieldWithBalance = React.forwardRef<HTMLInputElement, TokenFieldWithBalanceProps>(
  ({ tokenSymbol, valueInUSD, balance, ...rest }, ref): JSX.Element => {

    return (
      <TokenFieldWithBalanceWrapper>
        {balance && (
          // TODO: replace `valueInUSD` value with the balance value in USD according to the underlying token symbol
          <TokenBalance tokenSymbol={tokenSymbol} value={balance} valueInUSD={`${balance}00`} />
        )}
        <TokenFieldWrapper>
          <TokenFieldInput ref={ref} {...rest} />
          <TokenFieldSymbol>{tokenSymbol}</TokenFieldSymbol>
          <TokenFieldUSD>{`≈ $ ${valueInUSD}`}</TokenFieldUSD>
        </TokenFieldWrapper>
      </TokenFieldWithBalanceWrapper>
    );
  }
);
TokenFieldWithBalance.displayName = 'TokenFieldWithBalance';

export { TokenFieldWithBalance };
export type { TokenFieldWithBalanceProps };

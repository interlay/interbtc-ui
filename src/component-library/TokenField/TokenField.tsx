import * as React from 'react';

import { TokenFieldWrapper, TokenFieldInnerWrapper, TokenFieldSymbol, TokenFieldInput, TokenFieldUSD } from './TokenField.style';
import { NumberInputProps } from 'component-library/NumberInput';
import { TokenBalance } from 'component-library/TokenBalance';

interface TokenFieldProps extends NumberInputProps {
  balance?: {
    value: string;
    valueInUSD: string;
  }
  tokenSymbol: string;
  valueInUSD: string;
}

const TokenField = React.forwardRef<HTMLInputElement, TokenFieldProps>(
  ({ tokenSymbol, valueInUSD, balance, ...rest }, ref): JSX.Element => {

    return (
      <TokenFieldWrapper>
        {balance ? (
          <TokenBalance tokenSymbol={tokenSymbol} value={balance.value} valueInUSD={balance.valueInUSD} />
        ) : null}
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

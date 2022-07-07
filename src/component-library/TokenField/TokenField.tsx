import * as React from 'react';

import { TokenFieldSymbol, TokenFieldWrapper, TokenFieldInput, TokenFieldUSD } from './TokenField.style';
import { NumberInputProps } from 'component-library/NumberInput';

interface TokenFieldProps extends NumberInputProps {
  tokenSymbol: string;
  value: string;
  valueInUSD: string;
}

const TokenField = React.forwardRef<HTMLInputElement, TokenFieldProps>(
  ({ tokenSymbol, valueInUSD, ...rest }, ref): JSX.Element => {
    return (
      <TokenFieldWrapper>
        <TokenFieldInput ref={ref} {...rest} />
        <TokenFieldSymbol>{tokenSymbol}</TokenFieldSymbol>
        <TokenFieldUSD>{`≈ $ ${valueInUSD}`}</TokenFieldUSD>
      </TokenFieldWrapper>
    );
  }
);
TokenField.displayName = 'TokenField';

export { TokenField };
export type { TokenFieldProps };

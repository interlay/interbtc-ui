import * as React from 'react';

import { TokenFieldWithBalanceWrapper } from './TokenFieldWithBalance.style';
import { TokenField, TokenFieldProps } from 'component-library/TokenField';
import { TokenBalance, TokenBalanceProps } from 'component-library/TokenBalance';

interface TokenFieldWithBalanceProps extends TokenFieldProps, TokenBalanceProps {}

const TokenFieldWithBalance = React.forwardRef<HTMLInputElement, TokenFieldWithBalanceProps>(
  ({ tokenSymbol, valueInUSD, value, ...rest }, ref): JSX.Element => {
    return (
      <TokenFieldWithBalanceWrapper>
        <TokenBalance tokenSymbol={tokenSymbol} value={value} valueInUSD={valueInUSD} />
        <TokenField ref={ref} tokenSymbol={tokenSymbol} value={value} valueInUSD={valueInUSD} {...rest} />
      </TokenFieldWithBalanceWrapper>
    );
  }
);
TokenFieldWithBalance.displayName = 'TokenFieldWithBalance';

export { TokenFieldWithBalance };
export type { TokenFieldWithBalanceProps };

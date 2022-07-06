// ray test touch <
import * as React from 'react';

import { TokenFieldWithBalanceWrapper } from './TokenFieldWithBalance.style';
import { TokenField, TokenFieldProps } from 'component-library/TokenField';
import { Balance, BalanceProps } from 'component-library/Balance';

// TODO:
// - `label` and `currencySymbol` are duplicated.
// - `approxUSD` and `usdValue` are duplicated.
// - `currencyValue` and `value` are duplicated.
interface TokenFieldWithBalanceProps extends TokenFieldProps, BalanceProps {}

// TODO:
// - `CurrencySymbols` type should be used for `label` of `TokenField`.

const TokenFieldWithBalance = React.forwardRef<HTMLInputElement, TokenFieldWithBalanceProps>(
  ({ currencySymbol, currencyValue, usdValue, approxUSD, label, value, ...rest }, ref): JSX.Element => {
    // TODO:
    // - `approxUSD` -> `usdValue` | `valueInUSD`
    // - `currencySymbol` -> `label`
    // - `currencyValue` -> `value`
    return (
      <TokenFieldWithBalanceWrapper>
        <Balance currencySymbol={currencySymbol} currencyValue={currencyValue} usdValue={usdValue} />
        <TokenField ref={ref} label={label} approxUSD={approxUSD} value={value} {...rest} />
      </TokenFieldWithBalanceWrapper>
    );
  }
);
TokenFieldWithBalance.displayName = 'TokenFieldWithBalance';

export { TokenFieldWithBalance };
export type { TokenFieldWithBalanceProps };
// ray test touch >

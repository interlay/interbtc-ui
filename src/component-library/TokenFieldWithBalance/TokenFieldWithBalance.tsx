import * as React from 'react';

import { TokenFieldWithBalanceWrapper } from './TokenFieldWithBalance.style';
import { TokenField, TokenFieldProps } from 'component-library/TokenField';
import { Balance, BalanceProps } from 'component-library/Balance';

// ray test touch <
// TODO:
// - `label` and `currencySymbol` are duplicated.
// - `approxUSD` and `usdValue` are duplicated.
// - `currencyValue` and `value` are duplicated.
interface TokenFieldWithBalanceProps extends TokenFieldProps, BalanceProps {}
// ray test touch >

// ray test touch <
// TODO:
// - `CurrencySymbols` type should be used for `label` of `TokenField`.
// ray test touch >

const TokenFieldWithBalance = React.forwardRef<HTMLInputElement, TokenFieldWithBalanceProps>(
  ({ currencySymbol, currencyValue, usdValue, approxUSD, label, value, ...rest }, ref): JSX.Element => {
    // ray test touch <
    // TODO:
    // - `approxUSD` -> `usdValue` | `valueInUSD`
    // - `currencySymbol` -> `label`
    // - `currencyValue` -> `value`
    // ray test touch >
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

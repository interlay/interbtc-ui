import { CurrencySymbols } from 'types/currency';

import { BalanceWrapper, BalanceLabel, BalanceValue } from './Balance.style';

interface BalanceProps {
  currencySymbol: CurrencySymbols;
  currencyValue: string;
  usdValue: string;
}

const Balance = ({ currencySymbol, currencyValue, usdValue }: BalanceProps): JSX.Element => {
  return (
    <BalanceWrapper>
      <BalanceLabel>Balance:</BalanceLabel>
      <BalanceValue>
        {currencyValue} {currencySymbol} (${usdValue})
      </BalanceValue>
    </BalanceWrapper>
  );
};
export { Balance };
export type { BalanceProps };

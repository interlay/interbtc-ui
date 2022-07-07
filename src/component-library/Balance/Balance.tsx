import { Tokens } from '../types';

import { BalanceWrapper, BalanceLabel, BalanceValue } from './Balance.style';

interface BalanceProps {
  currencySymbol: Tokens;
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

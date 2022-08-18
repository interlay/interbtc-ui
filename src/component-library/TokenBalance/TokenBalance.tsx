import { formatUSD } from '@/common/utils/utils';

import { TokenBalanceLabel, TokenBalanceValue, TokenBalanceWrapper } from './TokenBalance.style';

interface TokenBalanceProps {
  tokenSymbol: string;
  value: number;
  valueInUSD: number;
}

const TokenBalance = ({ tokenSymbol, value, valueInUSD }: TokenBalanceProps): JSX.Element => {
  return (
    <TokenBalanceWrapper>
      <TokenBalanceLabel>Balance:</TokenBalanceLabel>
      <TokenBalanceValue>
        {value} {tokenSymbol} ({formatUSD(valueInUSD)})
      </TokenBalanceValue>
    </TokenBalanceWrapper>
  );
};
export { TokenBalance };
export type { TokenBalanceProps };

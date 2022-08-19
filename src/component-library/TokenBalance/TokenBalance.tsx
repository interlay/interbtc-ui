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
        {/* ray test touch < */}
        {value} {tokenSymbol} ({formatUSD(valueInUSD)}){/* ray test touch > */}
      </TokenBalanceValue>
    </TokenBalanceWrapper>
  );
};
export { TokenBalance };
export type { TokenBalanceProps };

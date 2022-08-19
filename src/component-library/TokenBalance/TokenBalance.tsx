import { TokenBalanceLabel, TokenBalanceValue, TokenBalanceWrapper } from './TokenBalance.style';

interface TokenBalanceProps {
  tokenSymbol: string;
  value: string;
  valueInUSD: string;
}

const TokenBalance = ({ tokenSymbol, value, valueInUSD }: TokenBalanceProps): JSX.Element => {
  return (
    <TokenBalanceWrapper>
      <TokenBalanceLabel>Balance:</TokenBalanceLabel>
      <TokenBalanceValue>
        {/* ray test touch < */}
        {value} {tokenSymbol} ({valueInUSD}){/* ray test touch > */}
      </TokenBalanceValue>
    </TokenBalanceWrapper>
  );
};
export { TokenBalance };
export type { TokenBalanceProps };

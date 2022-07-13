import { TokenBalanceWrapper, TokenBalanceLabel, TokenBalanceValue } from './TokenBalance.style';

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
        {value} {tokenSymbol} (${valueInUSD})
      </TokenBalanceValue>
    </TokenBalanceWrapper>
  );
};
export { TokenBalance };
export type { TokenBalanceProps };

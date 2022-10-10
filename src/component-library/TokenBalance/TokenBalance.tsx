import { usePress } from '@react-aria/interactions';
import { ReactNode } from 'react';

import { TokenBalanceLabel, TokenBalanceValue, TokenBalanceWrapper } from './TokenBalance.style';

type TokenBalanceProps = {
  tokenSymbol: string;
  value: number;
  valueInUSD: string | number;
  onClickBalance?: () => void;
  isDisabled?: boolean;
  className?: string;
  renderBalance?: (balance: number) => ReactNode;
};

const TokenBalance = ({
  tokenSymbol,
  value,
  valueInUSD,
  onClickBalance,
  className,
  isDisabled,
  renderBalance
}: TokenBalanceProps): JSX.Element => {
  const isClickable = !!onClickBalance && !isDisabled;
  const { pressProps } = usePress({ onPress: onClickBalance, isDisabled: !isClickable });
  const balanceValueProps = isClickable
    ? {
        role: 'button',
        tabIndex: 0,
        'aria-label': 'apply balance',
        ...pressProps
      }
    : {};

  return (
    <TokenBalanceWrapper className={className}>
      <TokenBalanceLabel>Balance:</TokenBalanceLabel>
      <dd>
        <TokenBalanceValue $clickable={isClickable} {...balanceValueProps}>
          {renderBalance?.(value) || value} {tokenSymbol} ({valueInUSD})
        </TokenBalanceValue>
      </dd>
    </TokenBalanceWrapper>
  );
};

export { TokenBalance };
export type { TokenBalanceProps };

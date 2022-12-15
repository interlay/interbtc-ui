import { usePress } from '@react-aria/interactions';
import { ReactNode } from 'react';

import { TokenBalanceLabel, TokenBalanceValue, TokenBalanceWrapper } from './TokenInput.style';

type TokenBalanceProps = {
  tokenSymbol: string;
  value: number;
  onClickBalance?: () => void;
  isDisabled?: boolean;
  className?: string;
  renderBalance?: (balance: number) => ReactNode;
  label?: ReactNode;
};

const TokenBalance = ({
  tokenSymbol,
  value,
  onClickBalance,
  className,
  isDisabled,
  renderBalance,
  label = 'Balance'
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
      <TokenBalanceLabel>{label}</TokenBalanceLabel>
      <dd>
        <TokenBalanceValue $clickable={isClickable} {...balanceValueProps}>
          {renderBalance?.(value) || value} {tokenSymbol}
        </TokenBalanceValue>
      </dd>
    </TokenBalanceWrapper>
  );
};

export { TokenBalance };
export type { TokenBalanceProps };

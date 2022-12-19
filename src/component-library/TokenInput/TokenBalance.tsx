import { usePress } from '@react-aria/interactions';
import { ReactNode } from 'react';

import { formatNumber } from '@/common/utils/utils';

import { TokenBalanceLabel, TokenBalanceValue, TokenBalanceWrapper } from './TokenInput.style';

type TokenBalanceProps = {
  currency: string;
  value: number;
  onClickBalance?: () => void;
  isDisabled?: boolean;
  className?: string;
  label?: ReactNode;
  decimals?: number;
};

const TokenBalance = ({
  currency,
  value,
  onClickBalance,
  className,
  isDisabled,
  decimals,
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
          {formatNumber(value, { minimumFractionDigits: 0, maximumFractionDigits: decimals || 20 })} {currency}
        </TokenBalanceValue>
      </dd>
    </TokenBalanceWrapper>
  );
};

export { TokenBalance };
export type { TokenBalanceProps };

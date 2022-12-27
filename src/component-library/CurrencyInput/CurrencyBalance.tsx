import { usePress } from '@react-aria/interactions';
import { ReactNode } from 'react';

import { formatNumber } from '@/common/utils/utils';

import {
  StyledCurrencyBalanceLabel,
  StyledCurrencyBalanceValue,
  StyledCurrencyBalanceWrapper
} from './CurrencyInput.style';

type CurrencyBalanceProps = {
  currency: string;
  value: number;
  onClickBalance?: () => void;
  isDisabled?: boolean;
  className?: string;
  label?: ReactNode;
  decimals?: number;
};

const CurrencyBalance = ({
  currency,
  value,
  onClickBalance,
  className,
  isDisabled,
  decimals,
  label = 'Balance'
}: CurrencyBalanceProps): JSX.Element => {
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
    <StyledCurrencyBalanceWrapper className={className}>
      <StyledCurrencyBalanceLabel>{label}</StyledCurrencyBalanceLabel>
      <dd>
        <StyledCurrencyBalanceValue $isClickable={isClickable} {...balanceValueProps}>
          {formatNumber(value, { minimumFractionDigits: 0, maximumFractionDigits: decimals || 20 })} {currency}
        </StyledCurrencyBalanceValue>
      </dd>
    </StyledCurrencyBalanceWrapper>
  );
};

export { CurrencyBalance };
export type { CurrencyBalanceProps };

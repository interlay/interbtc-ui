import { usePress } from '@react-aria/interactions';
import { ReactNode } from 'react';

import { formatNumber } from '@/common/utils/utils';

import {
  StyledTokenInputBalanceLabel,
  StyledTokenInputBalanceValue,
  StyledTokenInputBalanceWrapper
} from './TokenInput.style';

type TokenInputBalanceProps = {
  token: string;
  value: number;
  onClickBalance?: () => void;
  isDisabled?: boolean;
  className?: string;
  label?: ReactNode;
  decimals?: number;
};

const TokenInputBalance = ({
  token,
  value,
  onClickBalance,
  className,
  isDisabled,
  decimals,
  label = 'Balance'
}: TokenInputBalanceProps): JSX.Element => {
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
    <StyledTokenInputBalanceWrapper className={className}>
      <StyledTokenInputBalanceLabel>{label}</StyledTokenInputBalanceLabel>
      <dd>
        <StyledTokenInputBalanceValue $isClickable={isClickable} {...balanceValueProps}>
          {formatNumber(value, { minimumFractionDigits: 0, maximumFractionDigits: decimals || 20 })} {token}
        </StyledTokenInputBalanceValue>
      </dd>
    </StyledTokenInputBalanceWrapper>
  );
};

export { TokenInputBalance };
export type { TokenInputBalanceProps };

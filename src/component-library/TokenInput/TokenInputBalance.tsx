import { useFocusRing } from '@react-aria/focus';
import { usePress } from '@react-aria/interactions';
import { mergeProps } from '@react-aria/utils';
import { ReactNode, useMemo } from 'react';

import { formatNumber } from '@/common/utils/utils';

import {
  StyledTokenInputBalanceLabel,
  StyledTokenInputBalanceValue,
  StyledTokenInputBalanceWrapper
} from './TokenInput.style';

type TokenInputBalanceProps = {
  ticker?: string;
  value: number;
  onClickBalance?: () => void;
  isDisabled?: boolean;
  className?: string;
  label?: ReactNode;
  decimals?: number;
};

const TokenInputBalance = ({
  ticker,
  value,
  onClickBalance,
  className,
  isDisabled,
  decimals,
  label = 'Balance'
}: TokenInputBalanceProps): JSX.Element => {
  const { pressProps } = usePress({ onPress: onClickBalance, isDisabled: isDisabled });
  const { focusProps, isFocusVisible } = useFocusRing();
  const balanceValueProps = isDisabled
    ? {}
    : {
        role: 'button',
        tabIndex: 0,
        'aria-label': 'apply balance',
        ...mergeProps(pressProps, focusProps)
      };

  const balanceLabel = useMemo(
    () =>
      ticker
        ? formatNumber(value, { minimumFractionDigits: 0, maximumFractionDigits: decimals || 20, rounding: false })
        : 0,
    [decimals, ticker, value]
  );

  return (
    <StyledTokenInputBalanceWrapper className={className}>
      <StyledTokenInputBalanceLabel>{label}</StyledTokenInputBalanceLabel>
      <dd>
        <StyledTokenInputBalanceValue $isDisabled={isDisabled} $isFocusVisible={isFocusVisible} {...balanceValueProps}>
          {balanceLabel}
        </StyledTokenInputBalanceValue>
      </dd>
    </StyledTokenInputBalanceWrapper>
  );
};

export { TokenInputBalance };
export type { TokenInputBalanceProps };

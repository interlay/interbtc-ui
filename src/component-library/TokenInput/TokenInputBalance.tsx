import { useFocusRing } from '@react-aria/focus';
import { usePress } from '@react-aria/interactions';
import { mergeProps } from '@react-aria/utils';
import { ReactNode } from 'react';

import {
  StyledTokenInputBalanceLabel,
  StyledTokenInputBalanceValue,
  StyledTokenInputBalanceWrapper
} from './TokenInput.style';

type TokenInputBalanceProps = {
  ticker?: string;
  value: string | number;
  onClickBalance?: () => void;
  isDisabled?: boolean;
  className?: string;
  label?: ReactNode;
};

const TokenInputBalance = ({
  ticker,
  value,
  onClickBalance,
  className,
  isDisabled,
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

  return (
    <StyledTokenInputBalanceWrapper className={className}>
      <StyledTokenInputBalanceLabel>{label}</StyledTokenInputBalanceLabel>
      <dd>
        <StyledTokenInputBalanceValue $isDisabled={isDisabled} $isFocusVisible={isFocusVisible} {...balanceValueProps}>
          {ticker ? value : 0}
        </StyledTokenInputBalanceValue>
      </dd>
    </StyledTokenInputBalanceWrapper>
  );
};

export { TokenInputBalance };
export type { TokenInputBalanceProps };

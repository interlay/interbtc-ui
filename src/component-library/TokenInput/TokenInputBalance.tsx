import { ReactNode } from 'react';

import { CTA } from '../CTA';
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
}: TokenInputBalanceProps): JSX.Element => (
  <StyledTokenInputBalanceWrapper className={className}>
    <StyledTokenInputBalanceLabel>{label}</StyledTokenInputBalanceLabel>
    <dd>
      <StyledTokenInputBalanceValue>{ticker ? value : 0}</StyledTokenInputBalanceValue>
    </dd>
    // TODO: change border radius
    <CTA onPress={onClickBalance} disabled={isDisabled} size='x-small'>
      MAX
    </CTA>
  </StyledTokenInputBalanceWrapper>
);

export { TokenInputBalance };
export type { TokenInputBalanceProps };

import { CurrencyExt } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';

import { DlGroup, Dt, Status } from '@/component-library';

import { StyledDd, StyledSpan } from './BorrowLimit.style';

type RemainingDebtProps = {
  status: Status;
  remainingDebt: MonetaryAmount<CurrencyExt>;
  actionAmount: MonetaryAmount<CurrencyExt>;
};

const RemainingDebt = ({ status, actionAmount, remainingDebt }: RemainingDebtProps): JSX.Element | null => {
  const newRemainingDebt = actionAmount.gt(remainingDebt) ? 0 : remainingDebt?.sub(actionAmount).toHuman();

  return (
    <DlGroup wrap justifyContent='space-between'>
      <Dt>Remaining debt</Dt>
      <StyledDd $status={status}>
        <StyledSpan>
          {remainingDebt.toHuman()} {remainingDebt.currency.ticker}
        </StyledSpan>
        <StyledSpan>--&gt;</StyledSpan>
        <StyledSpan>
          {newRemainingDebt} {remainingDebt.currency.ticker}
        </StyledSpan>
      </StyledDd>
    </DlGroup>
  );
};

export { RemainingDebt };
export type { RemainingDebtProps };

import { CurrencyExt, LoanAsset } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { useTranslation } from 'react-i18next';

import { displayMonetaryAmount, formatUSD } from '@/common/utils/utils';
import { DlGroup, Dt } from '@/component-library';
import { useAccountBorrowLimit } from '@/pages/Loans/LoansOverview/hooks/use-get-account-borrow-limit';
import { LoanAction } from '@/types/loans';

import { useGetAccountHealthFactor } from '../../hooks/use-get-account-health-factor';
import { isBorrowAsset } from '../../utils/is-loan-asset';
import { LoanScore } from '../LoanScore';
import { StyledAlert, StyledDd, StyledDl, StyledWarningIcon } from './BorrowLimit.style';

const LIQUIDATION_ALERT_SCORE = 1.5;

type BorrowLimitProps = {
  loanAction: LoanAction;
  asset: LoanAsset;
  actionAmount: MonetaryAmount<CurrencyExt>;
  shouldDisplayLiquidationAlert?: boolean;
};

const BorrowLimit = ({
  loanAction,
  asset,
  actionAmount,
  shouldDisplayLiquidationAlert
}: BorrowLimitProps): JSX.Element | null => {
  const { t } = useTranslation();

  const { data: borrowLimitUSD, getBorrowLimitUSD } = useAccountBorrowLimit();
  const { getHealthFactor } = useGetAccountHealthFactor();

  const newBorrowLimit = getBorrowLimitUSD({ type: loanAction, amount: actionAmount, asset });
  const healthFactor = getHealthFactor({ type: loanAction, amount: actionAmount, asset });

  if (!healthFactor || !borrowLimitUSD || !newBorrowLimit) {
    return null;
  }

  const { status, statusLabel, value, valueLabel } = healthFactor;

  const hasLiquidationAlert =
    shouldDisplayLiquidationAlert && isBorrowAsset(loanAction) && value < LIQUIDATION_ALERT_SCORE;

  const currentBorrowLimitLabel = formatUSD(borrowLimitUSD.toNumber(), { compact: true });
  const newBorrowLimitLabel = formatUSD(newBorrowLimit.toNumber(), { compact: true });

  const isExceedingBorrowingLiquidity = loanAction === 'borrow' && asset.availableCapacity.lt(actionAmount);

  return (
    <StyledDl direction='column'>
      <DlGroup justifyContent='space-between'>
        <Dt>Borrow Limit</Dt>
        <StyledDd $status={status}>
          {borrowLimitUSD && (
            <>
              <span>{currentBorrowLimitLabel}</span>
              <span>--&gt;</span>
            </>
          )}
          <span>{newBorrowLimitLabel}</span>
        </StyledDd>
      </DlGroup>
      <DlGroup justifyContent='space-between'>
        <Dt>Health Status</Dt>
        <StyledDd $status={status}>
          {statusLabel} ({valueLabel})
        </StyledDd>
      </DlGroup>
      <LoanScore score={value} aria-label='loan score' />
      {/* TODO: replace with Alert component */}
      {isExceedingBorrowingLiquidity && (
        <StyledAlert role='alert' gap='spacing4' alignItems='center'>
          <StyledWarningIcon />
          <div>
            The available liquidity to borrow {asset.currency.ticker} has exceed. Please borrow at most{' '}
            {displayMonetaryAmount(asset.availableCapacity)}
          </div>
        </StyledAlert>
      )}
      {hasLiquidationAlert && (
        <StyledAlert role='alert' gap='spacing4' alignItems='center'>
          <StyledWarningIcon />
          <div>
            {t('loans.action_will_recude_health_score', {
              action: loanAction === 'borrow' ? t('loans.borrowing') : t('loans.withdrawing')
            })}
          </div>
        </StyledAlert>
      )}
    </StyledDl>
  );
};

export { BorrowLimit };
export type { BorrowLimitProps };

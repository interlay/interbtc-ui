import { CurrencyExt } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { useTranslation } from 'react-i18next';

import { formatNumber, formatUSD } from '@/common/utils/utils';
import { DlGroup, Dt } from '@/component-library';
import { useAccountBorrowLimit } from '@/pages/Loans/LoansOverview/hooks/use-get-account-borrow-limit';
import { LoanAction } from '@/types/loans';

import { useLoansHealthFactor } from '../../hooks/use-get-account-health-factor';
import { getStatus, getStatusLabel } from '../../utils/get-status';
import { isBorrowAsset } from '../../utils/is-loan-asset';
import { LoanScore } from '../LoanScore';
import { StyledAlert, StyledDd, StyledDl, StyledWarningIcon } from './BorrowLimit.style';

const LIQUIDATION_ALERT_SCORE = 1.5;

type BorrowLimitProps = {
  variant: LoanAction;
  assetAmount: MonetaryAmount<CurrencyExt>;
  shouldDisplayLiquidationAlert?: boolean;
};

const BorrowLimit = ({ variant, assetAmount, shouldDisplayLiquidationAlert }: BorrowLimitProps): JSX.Element => {
  const { t } = useTranslation();

  const { data: borrowLimitUSD, getBorrowLimitUSD } = useAccountBorrowLimit();
  const { getHealthFactor } = useLoansHealthFactor();

  const newBorrowLimit = getBorrowLimitUSD({ type: variant, amount: assetAmount });
  const newHealthFactor = getHealthFactor({ type: variant, amount: assetAmount }) || 0;
  const status = getStatus(newHealthFactor);

  const hasLiquidationAlert =
    shouldDisplayLiquidationAlert && isBorrowAsset(variant) && newHealthFactor < LIQUIDATION_ALERT_SCORE;

  const statusLabel = getStatusLabel(status);
  const healthFactorLabel = newHealthFactor > 10 ? '10+' : formatNumber(newHealthFactor, { maximumFractionDigits: 2 });
  const currentBorrowLimitLabel = formatUSD(borrowLimitUSD?.toNumber() || 0, { compact: true });
  const newBorrowLimitLabel = formatUSD(newBorrowLimit?.toNumber() || 0, { compact: true });

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
          {statusLabel} ({healthFactorLabel})
        </StyledDd>
      </DlGroup>
      <LoanScore score={newHealthFactor} aria-label='loan score' />
      {/* TODO: replace with Alert component */}
      {hasLiquidationAlert && (
        <StyledAlert role='alert' gap='spacing4' alignItems='center'>
          <StyledWarningIcon />
          <div>
            {t('loans.action_will_recude_health_score', {
              action: variant === 'borrow' ? t('loans.borrowing') : t('loans.withdrawing')
            })}
          </div>
        </StyledAlert>
      )}
    </StyledDl>
  );
};

export { BorrowLimit };
export type { BorrowLimitProps };

import { CurrencyExt } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { useTranslation } from 'react-i18next';

import { formatUSD } from '@/common/utils/utils';
import { DlGroup, Dt } from '@/component-library';
import { LoanAction } from '@/types/loans';
import { useGetAccountLoansOverview } from '@/utils/hooks/api/loans/use-get-account-loans-overview';

import { getStatus, getStatusLabel } from '../../utils/get-status';
import { LoanScore } from '../LoanScore';
import { StyledAlert, StyledDd, StyledDl, StyledWarningIcon } from './BorrowLimit.style';

const LIQUIDATION_ALERT_SCORE = 1.5;

// TODO: needs to be verified after lib integration
type BorrowLimitProps = {
  variant: LoanAction;
  asset: MonetaryAmount<CurrencyExt>;
  shouldDisplayLiquidationAlert?: boolean;
};

const BorrowLimit = ({ variant, asset, shouldDisplayLiquidationAlert }: BorrowLimitProps): JSX.Element => {
  const { t } = useTranslation();
  const {
    getNewCollateralRatio,
    getNewBorrowLimitUSDValue,
    data: { borrowLimitUSDValue }
  } = useGetAccountLoansOverview();

  const newBorrowLimit = getNewBorrowLimitUSDValue(variant, asset.currency, asset)?.toNumber() || 0;
  const newCollateralRatio = getNewCollateralRatio(variant, asset.currency, asset) || 0;
  const status = getStatus(newCollateralRatio);
  const statusLabel = getStatusLabel(status);

  const hasLiquidationAlert =
    shouldDisplayLiquidationAlert &&
    (variant === 'borrow' || variant === 'withdraw') &&
    newCollateralRatio < LIQUIDATION_ALERT_SCORE;

  return (
    <StyledDl direction='column'>
      <DlGroup justifyContent='space-between'>
        <Dt>Borrow Limit</Dt>
        <StyledDd $status={status}>
          {borrowLimitUSDValue && (
            <>
              <span>{formatUSD(borrowLimitUSDValue.toNumber(), { compact: true })}</span>
              <span>--&gt;</span>
            </>
          )}
          <span>{formatUSD(newBorrowLimit, { compact: true })}</span>
        </StyledDd>
      </DlGroup>
      <DlGroup justifyContent='space-between'>
        <Dt>Health Status</Dt>
        <StyledDd $status={status}>{statusLabel}</StyledDd>
      </DlGroup>
      <LoanScore score={newCollateralRatio} aria-label='loan score' />
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

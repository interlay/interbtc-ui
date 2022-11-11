import { CurrencyExt } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { useTranslation } from 'react-i18next';

import { formatNumber, formatUSD } from '@/common/utils/utils';
import { DlGroup, Dt } from '@/component-library';
import { Status } from '@/component-library/utils/prop-types';
import { LoanAction } from '@/types/loans';
import { useGetAccountLoansOverview } from '@/utils/hooks/api/loans/use-get-account-loans-overview';

import { isLiquidation } from '../../utils/is-liquidation';
import { LoanScore } from '../LoanScore';
import { StyledAlert, StyledDd, StyledDl, StyledWarningIcon } from './BorrowLimit.style';

const getScore = (score: number, liquidationScore = 0): string | number => {
  if (isLiquidation(score, liquidationScore)) {
    return 'Liquidation';
  }

  return score > 10 ? '10+' : formatNumber(score, { maximumFractionDigits: 2 });
};

const getStatus = (score: number, thresholds: Record<Status, number>): Status => {
  if (score <= thresholds.error) return 'error';
  if (score <= thresholds.warning) return 'warning';
  return 'success';
};

// TODO: needs to be verified after lib integration
type BorrowLimitProps = {
  variant: LoanAction;
  thresholds: Record<Status, number>;
  asset: MonetaryAmount<CurrencyExt>;
  shouldDisplayLiquidationAlert?: boolean;
};

const BorrowLimit = ({ variant, thresholds, asset, shouldDisplayLiquidationAlert }: BorrowLimitProps): JSX.Element => {
  const { t } = useTranslation();
  const {
    getNewCollateralRatio,
    getNewBorrowLimitUSDValue,
    data: { borrowLimitUSDValue, collateralRatio }
  } = useGetAccountLoansOverview();

  const newBorrowLimit = getNewBorrowLimitUSDValue(variant, asset.currency, asset)?.toNumber() || 0;
  const newCollateralRatio = getNewCollateralRatio(variant, asset.currency, asset) || 0;
  const status = getStatus(newCollateralRatio, thresholds);
  const hasLiquidationAlert =
    shouldDisplayLiquidationAlert &&
    (variant === 'borrow' || variant === 'withdraw') &&
    newCollateralRatio < (thresholds.error + thresholds.warning) / 2;

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
        <Dt>Health Score</Dt>
        <StyledDd $status={status}>
          {status === 'error' && <StyledWarningIcon />}
          {collateralRatio && (
            <>
              <span>{getScore(collateralRatio)}</span>
              <span>--&gt;</span>
            </>
          )}
          <span>{getScore(newCollateralRatio, thresholds.error)}</span>
        </StyledDd>
      </DlGroup>
      <LoanScore ranges={thresholds} score={newCollateralRatio} aria-label='loan score' />
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

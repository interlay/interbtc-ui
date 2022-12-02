import { CurrencyExt, LoanAsset } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { useTranslation } from 'react-i18next';

import { formatPercentage, formatUSD } from '@/common/utils/utils';
import { DlGroup, Dt } from '@/component-library';
import { useAccountBorrowLimit } from '@/pages/Loans/LoansOverview/hooks/use-get-account-borrow-limit';
import { LoanAction } from '@/types/loans';
import { useGetAccountPositions } from '@/utils/hooks/api/loans/use-get-account-positions';

import { useGetLTV } from '../../hooks/use-get-ltv';
import { isBorrowAsset } from '../../utils/is-loan-asset';
import { LTVMeter } from '../LTVMeter.tsx';
import { StyledAlert, StyledDd, StyledDl, StyledWarningIcon } from './BorrowLimit.style';

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

  const {
    data: { statistics }
  } = useGetAccountPositions();
  const { thresholds } = statistics || {};
  const { data: previousBorrowLimit, getBorrowLimitUSD } = useAccountBorrowLimit();
  const { data: prevLTV, getLTV } = useGetLTV();

  const currenBorrowLimit = getBorrowLimitUSD({ type: loanAction, amount: actionAmount, asset });
  const currentLTV = getLTV({ type: loanAction, amount: actionAmount, asset });

  if (!prevLTV || !currentLTV || !previousBorrowLimit || !currenBorrowLimit) {
    return null;
  }

  const hasLiquidationAlert =
    shouldDisplayLiquidationAlert && isBorrowAsset(loanAction) && currentLTV.status === 'error';

  const prevLTVtLabel = formatPercentage(prevLTV.value);
  const currentLTVLabel = formatPercentage(currentLTV.value);

  const previousBorrowLimitLabel = formatUSD(previousBorrowLimit.toNumber(), { compact: true });
  const currenBorrowLimitLabel = formatUSD(currenBorrowLimit.toNumber(), { compact: true });

  return (
    <StyledDl direction='column'>
      <DlGroup justifyContent='space-between'>
        <Dt>Borrow Limit</Dt>
        <StyledDd $status={currentLTV.status}>
          {previousBorrowLimit && (
            <>
              <span>{previousBorrowLimitLabel}</span>
              <span>--&gt;</span>
            </>
          )}
          <span>{currenBorrowLimitLabel}</span>
        </StyledDd>
      </DlGroup>
      <DlGroup justifyContent='space-between'>
        <Dt>LTV</Dt>
        <StyledDd $status={currentLTV.status}>
          {prevLTV && (
            <>
              <span>{prevLTVtLabel}</span>
              <span>--&gt;</span>
            </>
          )}
          <span>{currentLTVLabel}</span>
        </StyledDd>
      </DlGroup>
      <LTVMeter value={currentLTV.value} thresholds={thresholds} />
      {/* TODO: replace with Alert component */}
      {hasLiquidationAlert && (
        <StyledAlert role='alert' gap='spacing4' alignItems='center'>
          <StyledWarningIcon />
          <div>
            {t('loans.action_liquidation_risk', {
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

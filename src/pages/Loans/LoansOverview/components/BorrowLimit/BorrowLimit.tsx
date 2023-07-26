import { CurrencyExt, LoanAsset } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { useTranslation } from 'react-i18next';

import { displayMonetaryAmount, formatPercentage, formatUSD } from '@/common/utils/utils';
import { Alert, DlGroup, Dt } from '@/component-library';
import { Prices } from '@/hooks/api/use-get-prices';
import { useAccountBorrowLimit } from '@/pages/Loans/LoansOverview/hooks/use-get-account-borrow-limit';
import { LoanAction } from '@/types/loans';
import { getTokenPrice } from '@/utils/helpers/prices';

import { useGetLTV } from '../../hooks/use-get-ltv';
import { LTVMeter } from '../LTVMeter.tsx';
import { StyledDd, StyledDl, StyledSpan } from './BorrowLimit.style';
import { RemainingDebt } from './RemainingDebt';

type BorrowLimitProps = {
  loanAction: LoanAction;
  asset: LoanAsset;
  actionAmount: MonetaryAmount<CurrencyExt>;
  prices: Prices | undefined;
  shouldDisplayLiquidationAlert?: boolean;
  remainingDebt?: MonetaryAmount<CurrencyExt>;
};

const BorrowLimit = ({
  loanAction,
  asset,
  actionAmount,
  prices,
  remainingDebt,
  shouldDisplayLiquidationAlert
}: BorrowLimitProps): JSX.Element | null => {
  const { t } = useTranslation();

  const { data: currentBorrowLimit, getBorrowLimitUSD } = useAccountBorrowLimit();
  const { data: currentLTV, getLTV } = useGetLTV();

  const newBorrowLimit = getBorrowLimitUSD({ type: loanAction, amount: actionAmount, asset });
  const newLTV = getLTV({ type: loanAction, amount: actionAmount });

  if (!currentLTV || !newLTV || !currentBorrowLimit || !newBorrowLimit) {
    return null;
  }

  // Only show on borrow and withdraw because these could
  // have negative impact on the loan
  const hasLiquidationAlert =
    (loanAction === 'borrow' || loanAction === 'withdraw') &&
    shouldDisplayLiquidationAlert &&
    newLTV.status === 'error';

  const currentLTVLabel = formatPercentage(currentLTV.value);
  const newLTVLabel = formatPercentage(newLTV.value);

  const currentBorrowLimitLabel = formatUSD(currentBorrowLimit.toNumber(), { compact: true });
  const newBorrowLimitLabel = formatUSD(newBorrowLimit.toNumber(), { compact: true });

  const assetPrice = getTokenPrice(prices, asset.currency.ticker);
  const capacityUSD = asset.availableCapacity.toBig().mul(assetPrice?.usd || 0);
  const isExceedingBorrowingLiquidity = loanAction === 'borrow' && newBorrowLimit.gt(capacityUSD);

  return (
    <StyledDl direction='column'>
      {isExceedingBorrowingLiquidity && (
        <Alert status='warning'>
          The available liquidity to borrow {asset.currency.ticker} is lower than your borrow limit. You can borrow at
          most {displayMonetaryAmount(asset.availableCapacity)} {asset.currency.ticker}.
        </Alert>
      )}
      {remainingDebt && (
        <RemainingDebt actionAmount={actionAmount} remainingDebt={remainingDebt} status={newLTV.status} />
      )}
      <DlGroup justifyContent='space-between'>
        <Dt>Borrow Limit</Dt>
        <StyledDd $status={newLTV.status}>
          {currentBorrowLimit && (
            <>
              <StyledSpan>{currentBorrowLimitLabel}</StyledSpan>
              <StyledSpan>--&gt;</StyledSpan>
            </>
          )}
          <StyledSpan>{newBorrowLimitLabel}</StyledSpan>
        </StyledDd>
      </DlGroup>
      <DlGroup justifyContent='space-between'>
        <Dt>LTV</Dt>
        <StyledDd $status={newLTV.status}>
          {currentLTV && (
            <>
              <StyledSpan>{currentLTVLabel}</StyledSpan>
              <StyledSpan>--&gt;</StyledSpan>
            </>
          )}
          <StyledSpan>{newLTVLabel}</StyledSpan>
        </StyledDd>
      </DlGroup>
      <LTVMeter value={newLTV.value} ranges={newLTV.ranges} />
      {hasLiquidationAlert && (
        <Alert status='error'>
          {t('loans.action_liquidation_risk', {
            action: loanAction === 'borrow' ? t('loans.borrowing') : t('loans.withdrawing')
          })}
        </Alert>
      )}
    </StyledDl>
  );
};

export { BorrowLimit };
export type { BorrowLimitProps };

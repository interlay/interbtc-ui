import { CurrencyExt, LoanAsset } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { useTranslation } from 'react-i18next';

import { displayMonetaryAmount, formatPercentage, formatUSD } from '@/common/utils/utils';
import { Alert, DlGroup, Dt } from '@/component-library';
import { useAccountBorrowLimit } from '@/pages/Loans/LoansOverview/hooks/use-get-account-borrow-limit';
import { LoanAction } from '@/types/loans';
import { getTokenPrice } from '@/utils/helpers/prices';
import { useGetAccountPositions } from '@/utils/hooks/api/loans/use-get-account-positions';
import { Prices } from '@/utils/hooks/api/use-get-prices';

import { useGetLTV } from '../../hooks/use-get-ltv';
import { isBorrowAsset } from '../../utils/is-loan-asset';
import { LTVMeter } from '../LTVMeter.tsx';
import { StyledDd, StyledDl } from './BorrowLimit.style';

type BorrowLimitProps = {
  loanAction: LoanAction;
  asset: LoanAsset;
  actionAmount: MonetaryAmount<CurrencyExt>;
  prices: Prices | undefined;
  shouldDisplayLiquidationAlert?: boolean;
};

const BorrowLimit = ({
  loanAction,
  asset,
  actionAmount,
  prices,
  shouldDisplayLiquidationAlert
}: BorrowLimitProps): JSX.Element | null => {
  const { t } = useTranslation();

  const {
    data: { statistics }
  } = useGetAccountPositions();
  const { thresholds } = statistics || {};
  const { data: prevBorrowLimit, getBorrowLimitUSD } = useAccountBorrowLimit();
  const { data: prevLTV, getLTV } = useGetLTV();

  const currenBorrowLimit = getBorrowLimitUSD({ type: loanAction, amount: actionAmount, asset });
  const currentLTV = getLTV({ type: loanAction, amount: actionAmount, asset });

  if (!prevLTV || !currentLTV || !prevBorrowLimit || !currenBorrowLimit) {
    return null;
  }

  const hasLiquidationAlert =
    shouldDisplayLiquidationAlert && isBorrowAsset(loanAction) && currentLTV.status === 'error';

  const prevLTVtLabel = formatPercentage(prevLTV.value);
  const currentLTVLabel = formatPercentage(currentLTV.value);

  const prevBorrowLimitLabel = formatUSD(prevBorrowLimit.toNumber(), { compact: true });
  const currenBorrowLimitLabel = formatUSD(currenBorrowLimit.toNumber(), { compact: true });

  const assetPrice = getTokenPrice(prices, asset.currency.ticker);
  const capacityUSD = asset.availableCapacity.toBig().mul(assetPrice?.usd || 0);
  const isExceedingBorrowingLiquidity = loanAction === 'borrow' && currenBorrowLimit.gt(capacityUSD);

  return (
    <StyledDl direction='column'>
      {isExceedingBorrowingLiquidity && (
        <Alert status='warning'>
          The available liquidity to borrow {asset.currency.ticker} is lower than your borrow limit. You can borrow at
          most {displayMonetaryAmount(asset.availableCapacity)} {asset.currency.ticker}.
        </Alert>
      )}
      <DlGroup justifyContent='space-between'>
        <Dt>Borrow Limit</Dt>
        <StyledDd $status={currentLTV.status}>
          {prevBorrowLimit && (
            <>
              <span>{prevBorrowLimitLabel}</span>
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
      {hasLiquidationAlert && (
        <Alert status='error'>
          {t('loans.action_will_recude_health_score', {
            action: loanAction === 'borrow' ? t('loans.borrowing') : t('loans.withdrawing')
          })}
        </Alert>
      )}
    </StyledDl>
  );
};

export { BorrowLimit };
export type { BorrowLimitProps };

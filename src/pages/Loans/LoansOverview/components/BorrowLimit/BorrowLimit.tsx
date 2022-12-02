import { CurrencyExt, LoanAsset } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { useTranslation } from 'react-i18next';

import { displayMonetaryAmount, formatUSD } from '@/common/utils/utils';
import { Alert, DlGroup, Dt } from '@/component-library';
import { useAccountBorrowLimit } from '@/pages/Loans/LoansOverview/hooks/use-get-account-borrow-limit';
import { LoanAction } from '@/types/loans';
import { getTokenPrice } from '@/utils/helpers/prices';
import { Prices } from '@/utils/hooks/api/use-get-prices';

import { useGetAccountHealthFactor } from '../../hooks/use-get-account-health-factor';
import { isBorrowAsset } from '../../utils/is-loan-asset';
import { LoanScore } from '../LoanScore';
import { StyledDd, StyledDl } from './BorrowLimit.style';

const LIQUIDATION_ALERT_SCORE = 1.5;

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

  const assetPrice = getTokenPrice(prices, asset.currency.ticker);
  const capacityUSD = asset.availableCapacity.toBig().mul(assetPrice?.usd || 0);
  const isExceedingBorrowingLiquidity = loanAction === 'borrow' && borrowLimitUSD.gt(capacityUSD);

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

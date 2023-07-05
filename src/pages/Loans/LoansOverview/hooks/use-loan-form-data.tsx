import {
  BorrowPosition,
  CollateralPosition,
  CurrencyExt,
  LendingStats,
  LoanAsset,
  newMonetaryAmount
} from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';

import { BorrowAction, LendAction, LoanAction } from '@/types/loans';
import { getTokenPrice } from '@/utils/helpers/prices';
import { useGetAccountLendingStatistics } from '@/utils/hooks/api/loans/use-get-account-lending-statistics';
import { useGetBalances } from '@/utils/hooks/api/tokens/use-get-balances';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';

import { getMaxBorrowableAmount } from '../utils/get-max-borrowable-amount';
import { getMaxLendableAmount } from '../utils/get-max-lendable-amount';
import { getMaxWithdrawableAmount } from '../utils/get-max-withdrawable-amount';

type GetMaxAmountParams = {
  loanAction: LoanAction;
  asset: LoanAsset;
  assetBalance?: MonetaryAmount<CurrencyExt>;
  position?: CollateralPosition | BorrowPosition;
  lendingStats?: LendingStats;
};

const getMaxCalculatedAmount = ({
  loanAction,
  asset,
  position,
  lendingStats
}: GetMaxAmountParams): MonetaryAmount<CurrencyExt> => {
  switch (loanAction) {
    case 'lend':
      return getMaxLendableAmount(asset);
    case 'withdraw':
      return getMaxWithdrawableAmount(asset, position as CollateralPosition, lendingStats);
    case 'borrow':
      return getMaxBorrowableAmount(asset, lendingStats);
    case 'repay':
      return position
        ? position.amount.add((position as BorrowPosition).accumulatedDebt)
        : newMonetaryAmount(0, asset.currency);
  }
};

type UseLoanFormData = {
  assetPrice: number;
  assetAmount: {
    available: MonetaryAmount<CurrencyExt>;
    min: MonetaryAmount<CurrencyExt>;
    max: MonetaryAmount<CurrencyExt>;
  };
};

const useLoanFormData = (
  loanAction: BorrowAction | LendAction,
  asset: LoanAsset,
  position?: CollateralPosition | BorrowPosition
): UseLoanFormData => {
  const { getAvailableBalance } = useGetBalances();
  const prices = useGetPrices();
  const { data: statistics } = useGetAccountLendingStatistics();

  const zeroAssetAmount = newMonetaryAmount(0, asset.currency);

  const assetBalance = getAvailableBalance(asset.currency.ticker) || zeroAssetAmount;
  const assetPrice = getTokenPrice(prices, asset.currency.ticker)?.usd || 0;

  const minAmount = newMonetaryAmount(1, assetBalance.currency);

  const maxAmountParams: GetMaxAmountParams = {
    loanAction,
    asset,
    assetBalance,
    position,
    lendingStats: statistics
  };
  const maxAmountData = getMaxCalculatedAmount(maxAmountParams);

  const available =
    loanAction === 'lend' || loanAction === 'repay'
      ? maxAmountData.gt(assetBalance)
        ? assetBalance
        : maxAmountData
      : maxAmountData;

  return {
    assetPrice,
    assetAmount: {
      available,
      min: minAmount,
      max: maxAmountData
    }
  };
};

export { useLoanFormData };

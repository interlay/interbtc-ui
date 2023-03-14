import {
  BorrowPosition,
  CollateralPosition,
  CurrencyExt,
  LendingStats,
  LoanAsset,
  newMonetaryAmount
} from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';

import { GOVERNANCE_TOKEN, TRANSACTION_FEE_AMOUNT } from '@/config/relay-chains';
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

const getMaxAmount = ({
  loanAction,
  asset,
  assetBalance,
  position,
  lendingStats
}: GetMaxAmountParams): MonetaryAmount<CurrencyExt> | undefined => {
  switch (loanAction) {
    case 'borrow':
      return getMaxBorrowableAmount(asset, lendingStats);
    case 'withdraw':
      return getMaxWithdrawableAmount(asset, position as CollateralPosition, lendingStats);
    case 'lend':
      return getMaxLendableAmount(assetBalance, asset);
    case 'repay':
      return position?.amount.add((position as BorrowPosition).accumulatedDebt || 0);
  }
};

// Only relevant for withdraw or repay
const isEqualBalance = (
  variant: LoanAction,
  maxAmount: MonetaryAmount<CurrencyExt>,
  assetBalance: MonetaryAmount<CurrencyExt>,
  position?: CollateralPosition | BorrowPosition
) => {
  switch (variant) {
    case 'withdraw': {
      return !!position?.amount && maxAmount.eq(position.amount);
    }
    case 'repay': {
      return maxAmount.eq(assetBalance);
    }
    default: {
      return false;
    }
  }
};

type UseLoanFormData = {
  governanceBalance: MonetaryAmount<CurrencyExt>;
  transactionFee: MonetaryAmount<CurrencyExt>;
  assetPrice: number;
  balance: MonetaryAmount<CurrencyExt>;
  assetAmount: {
    available: MonetaryAmount<CurrencyExt>;
    min: MonetaryAmount<CurrencyExt>;
    max: { value: MonetaryAmount<CurrencyExt>; isEqualBalance: boolean };
  };
};

// TODO: reduce GOVERNANCE for fees from max amount
const useLoanFormData = (
  loanAction: BorrowAction | LendAction,
  asset: LoanAsset,
  position?: CollateralPosition | BorrowPosition
): UseLoanFormData => {
  const { getBalance, getAvailableBalance } = useGetBalances();
  const prices = useGetPrices();
  const { data: statistics } = useGetAccountLendingStatistics();

  const zeroAssetAmount = newMonetaryAmount(0, asset.currency);

  const governanceBalance = getBalance(GOVERNANCE_TOKEN.ticker)?.free || newMonetaryAmount(0, GOVERNANCE_TOKEN);
  const transactionFee = TRANSACTION_FEE_AMOUNT;
  const assetBalance = getAvailableBalance(asset.currency.ticker) || zeroAssetAmount;
  const assetPrice = getTokenPrice(prices, asset.currency.ticker)?.usd || 0;

  const maxAmountParams: GetMaxAmountParams = {
    loanAction,
    asset,
    assetBalance,
    position,
    lendingStats: statistics
  };

  const maxAmount = getMaxAmount(maxAmountParams) || zeroAssetAmount;
  const minAmount = newMonetaryAmount(1, assetBalance.currency);

  return {
    governanceBalance,
    transactionFee,
    assetPrice,
    balance: loanAction === 'repay' ? (assetBalance.gt(maxAmount) ? maxAmount : assetBalance) : maxAmount,
    assetAmount: {
      available: assetBalance,
      min: minAmount,
      // MEMO: checks for negative values
      max: {
        value: maxAmount.gte(zeroAssetAmount) ? maxAmount : zeroAssetAmount,
        isEqualBalance: isEqualBalance(loanAction, maxAmount, assetBalance, position)
      }
    }
  };
};

export { useLoanFormData };

import { BorrowPosition, CurrencyExt, LendPosition, LoanAsset, newMonetaryAmount } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import Big from 'big.js';

import { GOVERNANCE_TOKEN, TRANSACTION_FEE_AMOUNT } from '@/config/relay-chains';
import { BorrowAction, LendAction, LoanAction } from '@/types/loans';
import { getTokenPrice } from '@/utils/helpers/prices';
import { useGetAccountLoansOverview } from '@/utils/hooks/api/loans/use-get-account-positions-stats';
import { useGetBalances } from '@/utils/hooks/api/tokens/use-get-balances';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';

import { getMaxBorrowableAmount } from '../utils/get-max-borrowable-amount';
import { getMaxWithdrawableAmount } from '../utils/get-max-withdrawable-amount';

type GetMaxAmountParams = {
  loanAction: LoanAction;
  asset: LoanAsset;
  assetPrice?: number;
  assetBalance?: MonetaryAmount<CurrencyExt>;
  position?: LendPosition | BorrowPosition;
  totalBorrowedAmountUSD?: Big;
  totalCollateralAmountUSD?: Big;
};

const getMaxAmount = ({
  loanAction,
  asset,
  assetPrice,
  assetBalance,
  position,
  totalBorrowedAmountUSD,
  totalCollateralAmountUSD
}: GetMaxAmountParams): MonetaryAmount<CurrencyExt> | undefined => {
  switch (loanAction) {
    case 'borrow':
      return getMaxBorrowableAmount(asset, assetPrice, totalBorrowedAmountUSD, totalCollateralAmountUSD);
    case 'withdraw':
      return getMaxWithdrawableAmount(
        asset,
        assetPrice,
        position as LendPosition,
        totalBorrowedAmountUSD,
        totalCollateralAmountUSD
      );
    case 'lend':
      return assetBalance;
    case 'repay':
      return position?.amount.add((position as BorrowPosition).accumulatedDebt || 0);
  }
};

type UseLoanFormData = {
  governanceBalance: MonetaryAmount<CurrencyExt>;
  transactionFee: MonetaryAmount<CurrencyExt>;
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
  position?: LendPosition | BorrowPosition
): UseLoanFormData => {
  const { data: balances } = useGetBalances();
  const prices = useGetPrices();
  const {
    data: { borrowedAssetsUSDValue, collateralAssetsUSDValue }
  } = useGetAccountLoansOverview();

  const zeroAssetAmount = newMonetaryAmount(0, asset.currency);

  const governanceBalance = balances?.[GOVERNANCE_TOKEN.ticker].free || newMonetaryAmount(0, GOVERNANCE_TOKEN);
  const transactionFee = TRANSACTION_FEE_AMOUNT;
  const assetBalance = balances?.[asset.currency.ticker].free || zeroAssetAmount;
  const assetPrice = getTokenPrice(prices, asset.currency.ticker)?.usd || 0;

  const maxAmountParams: GetMaxAmountParams = {
    loanAction,
    asset,
    assetPrice,
    assetBalance,
    position,
    totalBorrowedAmountUSD: borrowedAssetsUSDValue,
    totalCollateralAmountUSD: collateralAssetsUSDValue
  };

  const maxAmount = getMaxAmount(maxAmountParams) || zeroAssetAmount;
  const minAmount = newMonetaryAmount(1, assetBalance.currency);

  return {
    governanceBalance,
    transactionFee,
    assetPrice,
    assetAmount: {
      available: assetBalance,
      min: minAmount,
      max: maxAmount
    }
  };
};

export { useLoanFormData };

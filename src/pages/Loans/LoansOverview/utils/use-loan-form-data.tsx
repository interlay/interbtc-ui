import { BorrowPosition, CurrencyExt, LoanAsset, newMonetaryAmount } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';

import { GOVERNANCE_TOKEN, TRANSACTION_FEE_AMOUNT } from '@/config/relay-chains';
import { BorrowAction, LendAction } from '@/types/loans';
import { getTokenPrice } from '@/utils/helpers/prices';
import { useGetAccountLoansOverview } from '@/utils/hooks/api/loans/use-get-account-loans-overview';
import { useGetBalances } from '@/utils/hooks/api/tokens/use-get-balances';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';

type UseLoanFormData = {
  governance: MonetaryAmount<CurrencyExt>;
  transaction: MonetaryAmount<CurrencyExt>;
  assetPrice: number;
  assetAmount: {
    available: MonetaryAmount<CurrencyExt>;
    min: MonetaryAmount<CurrencyExt>;
    max: MonetaryAmount<CurrencyExt>;
  };
};

const useLoanFormData = (
  variant: BorrowAction | LendAction,
  asset: LoanAsset,
  position?: BorrowPosition
): UseLoanFormData => {
  const { data: balances } = useGetBalances();
  const prices = useGetPrices();
  const { getMaxBorrowableAmount, getMaxWithdrawableAmount } = useGetAccountLoansOverview();

  const zeroAssetAmount = newMonetaryAmount(0, asset.currency);

  const governance = balances?.[GOVERNANCE_TOKEN.ticker].free || newMonetaryAmount(0, GOVERNANCE_TOKEN);
  const transaction = TRANSACTION_FEE_AMOUNT;
  const assetBalance = balances?.[asset.currency.ticker].free || zeroAssetAmount;
  const assetPrice = getTokenPrice(prices, asset.currency.ticker)?.usd || 0;

  let maxAmount: MonetaryAmount<CurrencyExt>;

  switch (variant) {
    case 'borrow':
      maxAmount = getMaxBorrowableAmount(asset.currency, asset.availableCapacity) || zeroAssetAmount;
      break;
    case 'withdraw':
      maxAmount = getMaxWithdrawableAmount(asset.currency) || zeroAssetAmount;
      break;
    case 'lend':
      maxAmount = assetBalance;
      break;
    default:
      maxAmount = position?.amount || zeroAssetAmount;
      break;
  }

  const minAmount = newMonetaryAmount(0, assetBalance.currency).add(newMonetaryAmount(1, assetBalance.currency));

  return {
    governance,
    transaction,
    assetPrice,
    assetAmount: {
      available: assetBalance,
      min: minAmount,
      max: maxAmount
    }
  };
};

export { useLoanFormData };

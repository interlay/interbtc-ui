import { CurrencyExt, newMonetaryAmount } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';

import { GOVERNANCE_TOKEN, TRANSACTION_FEE_AMOUNT } from '@/config/relay-chains';
import { getTokenPrice } from '@/utils/helpers/prices';
import { useGetBalances } from '@/utils/hooks/api/tokens/use-get-balances';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';

type UseAvailableBalance = { price: number; amount: MonetaryAmount<CurrencyExt> };

// MEMO: return available balance. If the currency is used for fees,
// we deduct the necessary to pay for a transaction.
const useAvailableBalance = (currency: CurrencyExt): UseAvailableBalance => {
  const { data: balances } = useGetBalances();
  const prices = useGetPrices();

  const price = getTokenPrice(prices, currency.ticker)?.usd || 0;
  const amount = balances?.[currency.ticker].free || newMonetaryAmount(0, currency);

  if (currency.ticker === GOVERNANCE_TOKEN.ticker) {
    const governanceAmount = amount.sub(TRANSACTION_FEE_AMOUNT);

    return {
      amount: governanceAmount.toBig().gte(0) ? governanceAmount : newMonetaryAmount(0, currency),
      price
    };
  }

  return {
    amount,
    price
  };
};

export { useAvailableBalance };

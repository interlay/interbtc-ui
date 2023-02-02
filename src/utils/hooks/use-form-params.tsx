import { CurrencyExt, newMonetaryAmount } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';

import { GOVERNANCE_TOKEN, TRANSACTION_FEE_AMOUNT } from '@/config/relay-chains';

import { useGetBalances } from './api/tokens/use-get-balances';

type UseFormParams = {
  fee: { amount: MonetaryAmount<CurrencyExt>; balance: MonetaryAmount<CurrencyExt> };
};

const useFormParams = (): UseFormParams => {
  const { getBalance } = useGetBalances();

  const governanceBalance = getBalance(GOVERNANCE_TOKEN.ticker)?.free || newMonetaryAmount(0, GOVERNANCE_TOKEN);

  return {
    fee: {
      amount: TRANSACTION_FEE_AMOUNT,
      balance: governanceBalance
    }
  };
};

export { useFormParams };

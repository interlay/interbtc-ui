import { newMonetaryAmount } from '@interlay/interbtc-api';

import { GOVERNANCE_TOKEN, TRANSACTION_FEE_AMOUNT } from '@/config/relay-chains';
import { SwapSchemaParams } from '@/lib/form-validation';
import { SwapPair } from '@/types/swap';
import { useGetBalances } from '@/utils/hooks/api/tokens/use-get-balances';

type UseSwapFormData = {
  input?: { balance: number; schema: SwapSchemaParams };
  output?: { balance: number; schema: SwapSchemaParams };
};

const useSwapFormData = (pairs: SwapPair): UseSwapFormData => {
  const { getAvailableBalance, getBalance } = useGetBalances();

  let input;
  let output;

  const common = {
    governanceBalance: getBalance(GOVERNANCE_TOKEN.ticker)?.free || newMonetaryAmount(0, GOVERNANCE_TOKEN),
    transactionFee: TRANSACTION_FEE_AMOUNT
  };

  if (pairs.input) {
    input = {
      balance: getAvailableBalance(pairs.input.ticker)?.toBig().toNumber() || 0,
      schema: {
        availableBalance: getAvailableBalance(pairs.input.ticker) || newMonetaryAmount(0, pairs.input),
        minAmount: newMonetaryAmount(1, pairs.input),
        ...common
      }
    };
  }

  if (pairs.output) {
    output = {
      balance: getAvailableBalance(pairs.output.ticker)?.toBig().toNumber() || 0,
      schema: {
        availableBalance: getAvailableBalance(pairs.output.ticker) || newMonetaryAmount(0, pairs.output),
        minAmount: newMonetaryAmount(1, pairs.output),
        ...common
      }
    };
  }

  return {
    input,
    output
  };
};

export { useSwapFormData };
export type { UseSwapFormData };

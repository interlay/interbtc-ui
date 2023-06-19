import { CurrencyExt, isCurrencyEqual, LiquidityPool } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { ExtrinsicStatus } from '@polkadot/types/interfaces';
import { Key, useCallback, useMemo, useState } from 'react';
import { MutationFunction, useMutation, UseMutationOptions, UseMutationResult } from 'react-query';

import { GOVERNANCE_TOKEN } from '@/config/relay-chains';

import { useGetLiquidityPools } from '../api/amm/use-get-liquidity-pools';
import { useGetBalances } from '../api/tokens/use-get-balances';
import { useGetCurrencies } from '../api/use-get-currencies';
import { Transaction, TransactionActions, TransactionArgs } from './types';
import { estimateTransactionFee } from './utils/fee';
import { getParams } from './utils/params';

type FeeEstimateResult = MonetaryAmount<CurrencyExt> | undefined;

type EstimateArgs<T extends Transaction> = {
  // Executes the transaction
  estimate<D extends Transaction = T>(...args: TransactionArgs<D>): void;
};

type EstimateTypeArgs<T extends Transaction> = {
  estimate<D extends Transaction = T>(type: D, ...args: TransactionArgs<D>): void;
};

type EstimateFunctions<T extends Transaction> = EstimateArgs<T> | EstimateTypeArgs<T>;

type ReactQueryUseMutationResult = Omit<
  UseMutationResult<FeeEstimateResult, Error, TransactionActions, unknown>,
  'mutate' | 'mutateAsync' | 'data'
>;

const mutateFee: (
  currency: CurrencyExt,
  pools: Array<LiquidityPool>
) => MutationFunction<FeeEstimateResult, TransactionActions> = (currency, pools) => async (params) =>
  estimateTransactionFee(currency, pools || [], params);

type UseFeeEstimateResult<T extends Transaction> = {
  onSelectionChange: (ticker: Key) => void;
  availableBalance?: MonetaryAmount<CurrencyExt>;
  amount?: MonetaryAmount<CurrencyExt>;
  currency: CurrencyExt;
} & ReactQueryUseMutationResult &
  EstimateFunctions<T>;

type UseFeeEstimateOptions = Omit<
  UseMutationOptions<FeeEstimateResult, Error, TransactionActions, unknown>,
  'mutationFn'
> & {
  customStatus?: ExtrinsicStatus['type'];
  onChangeFeeEstimate?: (fee?: MonetaryAmount<CurrencyExt>) => void;
};

function useFeeEstimate<T extends Transaction>(
  type: T,
  options?: UseFeeEstimateOptions
): Exclude<UseFeeEstimateResult<T>, EstimateTypeArgs<T>>;
function useFeeEstimate<T extends Transaction>(
  options?: UseFeeEstimateOptions
): Exclude<UseFeeEstimateResult<T>, EstimateArgs<T>>;
function useFeeEstimate<T extends Transaction>(
  typeOrOptions: T | UseFeeEstimateOptions,
  options?: UseFeeEstimateOptions
): UseFeeEstimateResult<T> {
  const { getCurrencyFromTicker } = useGetCurrencies(true);
  const { getBalance } = useGetBalances();
  const { data: pools } = useGetLiquidityPools();

  const [currency, setCurrency] = useState(GOVERNANCE_TOKEN);

  // Only set when amount in trasaction is the same currency used to pay for fees
  const [actionFeeAmount, setActionFeeAmount] = useState<MonetaryAmount<CurrencyExt>>();

  const { customStatus, onChangeFeeEstimate } = options || {};

  const { mutate, data, ...feeMutation } = useMutation(mutateFee(currency, pools || []), {
    onSuccess: onChangeFeeEstimate
  });

  const handleEstimateFee = useCallback(
    async (...args: Parameters<UseFeeEstimateResult<T>['estimate']>) => {
      const params = getParams(args, typeOrOptions, customStatus);

      let actionAmount: MonetaryAmount<CurrencyExt> | undefined;

      switch (params.type) {
        case Transaction.TOKENS_TRANSFER: {
          const [, amount] = params.args;
          actionAmount = amount;
          break;
        }
      }

      if (actionAmount && isCurrencyEqual(actionAmount.currency, currency)) {
        setActionFeeAmount(actionAmount);
      }

      const result = await mutate(params);

      return result;
    },
    [typeOrOptions, customStatus, currency, mutate]
  );

  const handleFeeTokenSelection = (ticker: Key) => {
    // TODO: update TokenData to deal with Currency type
    const currency = getCurrencyFromTicker(ticker as string);

    if (!currency) return;

    setCurrency(currency);
  };

  const availableBalance = useMemo(() => {
    const balance = getBalance(currency.ticker)?.transferable;

    if (!actionFeeAmount || !isCurrencyEqual(actionFeeAmount.currency, currency)) {
      return balance;
    }

    return getBalance(currency.ticker)?.transferable.sub(actionFeeAmount);
  }, [actionFeeAmount, currency, getBalance]);

  return {
    ...feeMutation,
    amount: data,
    availableBalance,
    currency,
    onSelectionChange: handleFeeTokenSelection,
    estimate: handleEstimateFee
  } as any;
}

export { useFeeEstimate };
export type { FeeEstimateResult, UseFeeEstimateResult };

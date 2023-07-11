import { CurrencyExt } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useErrorHandler } from 'react-error-boundary';
import { MutationFunction, useMutation, UseMutationResult } from 'react-query';
import { useSelector } from 'react-redux';
import { useInterval } from 'react-use';

import { StoreType } from '@/common/types/util.types';
import { GOVERNANCE_TOKEN } from '@/config/relay-chains';
import { REFETCH_INTERVAL } from '@/utils/constants/api';

import { useGetLiquidityPools } from '../../api/amm/use-get-liquidity-pools';
import { useGetBalances } from '../../api/tokens/use-get-balances';
import { useGetCurrencies } from '../../api/use-get-currencies';
import { Actions, Transaction, TransactionArgs } from '../types';
import { UseTransactionOptions } from '../types/hook';
import { estimateTransactionFee, getActionAmount } from '../utils/fee';
import { getActionData } from '../utils/params';

type EstimateFeeVariables = { params: Actions; currency: CurrencyExt; isPreEstimate: boolean };

type FeeEstimateResult = {
  amount: MonetaryAmount<CurrencyExt>;
  isSameAsActionCurrency: boolean;
  isValid: boolean;
};

type EstimateArgs<T extends Transaction> = {
  estimate<D extends Transaction = T>(...args: TransactionArgs<D>): void;
  estimateAsync<D extends Transaction = T>(...args: TransactionArgs<D>): Promise<FeeEstimateResult>;
};

type EstimateTypeArgs<T extends Transaction> = {
  estimate<D extends Transaction = T>(type: D, ...args: TransactionArgs<D>): void;
  estimateAsync<D extends Transaction = T>(type: D, ...args: TransactionArgs<D>): Promise<FeeEstimateResult>;
};

type EstimateFunctions<T extends Transaction> = EstimateArgs<T> | EstimateTypeArgs<T>;

type ReactQueryUseFeeEstimateResult = Omit<
  UseMutationResult<FeeEstimateResult, Error, EstimateFeeVariables, unknown>,
  'mutate' | 'mutateAsync'
>;

type UseFeeEstimateResult<T extends Transaction> = {
  defaultCurrency: CurrencyExt;
  detailsProps: {
    currency: CurrencyExt;
    amount?: MonetaryAmount<CurrencyExt>;
    showInsufficientBalance?: boolean;
    onSelectionChange: (ticker: string) => void;
  };
} & ReactQueryUseFeeEstimateResult &
  EstimateFunctions<T>;

type PreEstimateVariablesWithoutType<T extends Transaction> = { args: TransactionArgs<T> };

type PreEstimateVariablesWithoutTypeFunction<T extends Transaction> = () => Promise<
  { args: TransactionArgs<T> } | undefined
>;

type PreEstimateVariablesHandlerWithoutType<T extends Transaction> =
  | PreEstimateVariablesWithoutType<T>
  | PreEstimateVariablesWithoutTypeFunction<T>;

type PreEstimateVariablesWithType<T extends Transaction> = { type: T; args: TransactionArgs<T> };

type PreEstimateVariablesWithTypeFunction<T extends Transaction> = () => Promise<
  { type: T; args: TransactionArgs<T> } | undefined
>;

type PreEstimateVariablesHandlerWithType<T extends Transaction> =
  | PreEstimateVariablesWithType<T>
  | PreEstimateVariablesWithTypeFunction<T>;

type PreEstimateVariablesHandler<T extends Transaction> =
  | PreEstimateVariablesHandlerWithoutType<T>
  | PreEstimateVariablesHandlerWithType<T>;

type UseFeeEstimateOptions<T extends Transaction> = {
  enablePreEstimate?: boolean;
  preEstimate?: PreEstimateVariablesHandler<T>;
};

const defaultFeeCurrency = GOVERNANCE_TOKEN;

function useFeeEstimate<T extends Transaction>({
  enablePreEstimate,
  preEstimate,
  typeOrOptions
}: UseFeeEstimateOptions<T> & { typeOrOptions?: T | UseTransactionOptions<T> }): UseFeeEstimateResult<T> {
  const { bridgeLoaded } = useSelector((state: StoreType) => state.general);
  const { data: pools } = useGetLiquidityPools();
  const { data: currencies, getCurrencyFromTicker } = useGetCurrencies(bridgeLoaded);
  const { data: balances, getBalance } = useGetBalances();

  const [feeCurrency, setFeeCurrency] = useState(defaultFeeCurrency);

  const feeResultRef = useRef<FeeEstimateResult>();

  const estimateFeeVariablesRef = useRef<EstimateFeeVariables>();

  const mutateFee: MutationFunction<FeeEstimateResult, EstimateFeeVariables> = useCallback(
    async ({ params, currency, isPreEstimate }) => {
      const feeBalance = getBalance(currency.ticker)?.transferable;

      // returning undefined means that action amount is not based on fee currency (i.e. amount being transfered)
      const actionAmount = getActionAmount(params, currency);

      // not valid if i.e amount transfering is higher than available balance
      const isSameAsActionCurrency = actionAmount && feeBalance && actionAmount.lte(feeBalance);

      const amount = await estimateTransactionFee(currency, pools || [], params);

      if (!isSameAsActionCurrency) {
        return {
          amount,
          isValid: true,
          isSameAsActionCurrency: !!actionAmount
        };
      }

      if (isPreEstimate) {
        return {
          amount,
          isValid: true,
          isSameAsActionCurrency: !!actionAmount
        };
      }

      const leftoverBalance = actionAmount && actionAmount.sub(amount);

      const result: FeeEstimateResult = {
        amount,
        isSameAsActionCurrency,
        isValid: !!leftoverBalance && leftoverBalance.toBig().gte(0)
      };

      feeResultRef.current = result;

      return result;
    },
    [getBalance, pools]
  );

  const { data, mutate, mutateAsync, ...feeMutation } = useMutation<
    FeeEstimateResult,
    Error,
    EstimateFeeVariables,
    unknown
  >(mutateFee);

  useErrorHandler(feeMutation.error);

  const handleEstimateFee = useCallback(
    (...args: Parameters<EstimateArgs<T>['estimate']>) => {
      const params = getActionData(args, typeOrOptions);

      const variables = { params, currency: feeCurrency, isPreEstimate: false };

      estimateFeeVariablesRef.current = variables;

      mutate(variables);
    },
    [typeOrOptions, feeCurrency, mutate]
  );

  const handleEstimateFeeAsync = useCallback(
    (...args: Parameters<EstimateArgs<T>['estimate']>) => {
      const params = getActionData(args, typeOrOptions);

      const variables = { params, currency: feeCurrency, isPreEstimate: false };

      estimateFeeVariablesRef.current = variables;

      return mutateAsync(variables);
    },
    [typeOrOptions, feeCurrency, mutateAsync]
  );

  useEffect(() => {
    const estimate = async () => {
      const estimateArgs = typeof preEstimate === 'function' ? await preEstimate() : preEstimate;

      if (!estimateArgs) return;

      const type = (estimateArgs as PreEstimateVariablesWithType<T>)?.type || typeOrOptions;

      const params = getActionData(estimateArgs.args, type);

      const variables = { params, currency: feeCurrency, isPreEstimate: true };

      estimateFeeVariablesRef.current = variables;

      mutate(variables);
    };

    const isReady = currencies && balances;

    if (!isReady) return;

    if (!data && preEstimate && enablePreEstimate) {
      estimate();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currencies, balances, enablePreEstimate]);

  // Re-estimate fee based on latest stored variables
  useInterval(() => {
    if (!estimateFeeVariablesRef.current || feeMutation.isLoading) return;
    mutate(estimateFeeVariablesRef.current);
  }, REFETCH_INTERVAL.MINUTE);

  const handleFeeSelectionChange = (ticker: string) => {
    const currency = getCurrencyFromTicker(ticker);

    setFeeCurrency(currency);

    const { params } = estimateFeeVariablesRef.current || {};

    if (!params) return;

    const variables = { params, currency, isPreEstimate: false };

    estimateFeeVariablesRef.current = variables;

    mutate(variables);
  };

  const result = data || feeResultRef.current;

  return {
    ...feeMutation,
    data: result,
    defaultCurrency: defaultFeeCurrency,
    estimate: handleEstimateFee,
    estimateAsync: handleEstimateFeeAsync,
    detailsProps: {
      currency: feeCurrency,
      amount: result?.amount,
      // could possible be undefined, so we want to check for that
      showInsufficientBalance: result?.isValid === false,
      onSelectionChange: handleFeeSelectionChange
    }
  };
}

export { useFeeEstimate };
export type { EstimateArgs, EstimateTypeArgs, FeeEstimateResult, UseFeeEstimateOptions, UseFeeEstimateResult };

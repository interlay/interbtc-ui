import { CurrencyExt, LiquidityPool } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { mergeProps } from '@react-aria/utils';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useErrorHandler } from 'react-error-boundary';
import { MutationFunction, useMutation } from 'react-query';
import { useInterval } from 'react-use';

import { GOVERNANCE_TOKEN } from '@/config/relay-chains';
import { useSubstrate } from '@/lib/substrate';
import { REFETCH_INTERVAL } from '@/utils/constants/api';

import { useGetLiquidityPools } from '../api/amm/use-get-liquidity-pools';
import { useGetBalances } from '../api/tokens/use-get-balances';
import { useGetCurrencies } from '../api/use-get-currencies';
import { getExtrinsic, getStatus } from './extrinsics';
import { Transaction, TransactionActions } from './types';
import {
  EstimateFeeParams,
  FeeEstimateResult,
  TransactionResult,
  UseTransactionOptions,
  UseTransactionOptionsWithoutType,
  UseTransactionOptionsWithType,
  UseTransactionResult,
  UseTransactionWithoutType,
  UseTransactionWithType
} from './types/hook';
import { useTransactionNotifications } from './use-transaction-notifications';
import { estimateTransactionFee, getActionAmount, wrapWithTxFeeSwap } from './utils/fee';
import { getParams } from './utils/params';
import { submitTransaction } from './utils/submit';

const defaultFeeCurrency = GOVERNANCE_TOKEN;

const mutateTransaction: (
  feeAmount: MonetaryAmount<CurrencyExt> | undefined,
  pools: Array<LiquidityPool>
) => MutationFunction<TransactionResult, TransactionActions> = (feeAmount, pools) => async (params) => {
  const expectedStatus = params.customStatus || getStatus(params.type);
  const baseExtrinsic = await getExtrinsic(params);
  const feeWrappedExtrinsic = wrapWithTxFeeSwap(feeAmount, baseExtrinsic, pools);

  return submitTransaction(
    window.bridge.api,
    params.accountAddress,
    feeWrappedExtrinsic,
    expectedStatus,
    params.events
  );
};

// The three declared functions are use to infer types on diferent implementations
function useTransaction<T extends Transaction>(
  type: T,
  options?: UseTransactionOptionsWithType<T>
): UseTransactionWithType<T>;
function useTransaction<T extends Transaction>(
  options?: UseTransactionOptionsWithoutType<T>
): UseTransactionWithoutType<T>;
function useTransaction<T extends Transaction>(
  typeOrOptions?: T | UseTransactionOptions<T>,
  options?: UseTransactionOptions<T>
): UseTransactionResult<T> {
  const { state } = useSubstrate();
  const { data: pools } = useGetLiquidityPools();
  const { getCurrencyFromTicker } = useGetCurrencies(true);
  const { getBalance } = useGetBalances();

  const [isSigned, setSigned] = useState(false);

  const { showSuccessModal, customStatus, prefetchFee, ...mutateOptions } =
    (typeof typeOrOptions === 'string' ? options : typeOrOptions) || {};

  const mutateFee: (
    pools: Array<LiquidityPool>
  ) => MutationFunction<FeeEstimateResult, EstimateFeeParams> = useCallback(
    (pools) => async ({ ticker, params }) => {
      const currency = getCurrencyFromTicker(ticker);

      const feeBalance = getBalance(currency.ticker)?.transferable;

      // returning undefined means that action amount is not based on fee currency
      const actionAmount = getActionAmount(params, currency);

      const availableBalance = actionAmount ? feeBalance?.sub(actionAmount) : feeBalance;

      const amount = await estimateTransactionFee(currency, pools || [], params);

      return {
        amount,
        isValid: !!availableBalance && !!amount && availableBalance.gte(amount)
      };
    },
    [getBalance, getCurrencyFromTicker]
  );

  const { mutate: feeMutate, ...feeMutation } = useMutation<FeeEstimateResult, Error, EstimateFeeParams, unknown>(
    mutateFee(pools || [])
  );

  useErrorHandler(feeMutation.error);

  const estimateFeeParamsRef = useRef<EstimateFeeParams>();

  const handleEstimateFee = useCallback(
    (ticker: string = defaultFeeCurrency.ticker) => (
      ...args: Parameters<UseTransactionResult<T>['fee']['estimate']>
    ) => {
      const params = getParams(args, typeOrOptions, customStatus);

      const variables = { ticker, params };

      estimateFeeParamsRef.current = variables;

      feeMutate(variables);
    },
    [typeOrOptions, customStatus, feeMutate]
  );

  const handleSetCurrency = (ticker?: string) => ({ estimate: handleEstimateFee(ticker) });

  useEffect(() => {
    if (feeMutation.data || !prefetchFee) return;

    const type = (prefetchFee as UseTransactionOptionsWithType<T>['prefetchFee'])?.type || typeOrOptions;

    const params = getParams(prefetchFee.args, type, customStatus);

    feeMutate({ params, ticker: defaultFeeCurrency.ticker });
  }, []);

  // Re-estimate fee based on latest stored variables
  useInterval(() => {
    if (!estimateFeeParamsRef.current || feeMutation.isLoading) return;

    feeMutate(estimateFeeParamsRef.current);
  }, REFETCH_INTERVAL.MINUTE);

  const notifications = useTransactionNotifications({ showSuccessModal });

  const { onSigning, ...optionsProp } = mergeProps(
    mutateOptions,
    {
      onMutate: () => setSigned(false),
      onSigning: () => setSigned(true),
      onError: (error: Error) => console.error(error.message),
      onSuccess: () => feeMutation.reset()
    },
    notifications.mutationProps
  );

  const { mutate, mutateAsync, ...transactionMutation } = useMutation(
    mutateTransaction(feeMutation.data?.amount, pools || []),
    optionsProp
  );

  // Handles params for both type of implementations
  const getBaseParams = useCallback(
    (args: Parameters<UseTransactionResult<T>['execute']>) => {
      const params = getParams(args, typeOrOptions, customStatus);

      // Execution should only ran when authenticated
      const accountAddress = state.selectedAccount?.address;

      const variables = {
        ...params,
        accountAddress
      } as TransactionActions;

      return {
        ...variables,
        events: {
          onReady: () => onSigning(variables)
        }
      };
    },
    [onSigning, customStatus, state.selectedAccount?.address, typeOrOptions]
  );

  const handleExecute = useCallback(
    (...args: Parameters<UseTransactionResult<T>['execute']>) => {
      const params = getBaseParams(args);

      return mutate(params);
    },
    [getBaseParams, mutate]
  );

  const handleExecuteAsync = useCallback(
    (...args: Parameters<UseTransactionResult<T>['executeAsync']>) => {
      const params = getBaseParams(args);

      return mutateAsync(params);
    },
    [getBaseParams, mutateAsync]
  );

  const handleReject = (error?: Error) => {
    notifications.onReject(error);
    setSigned(false);

    if (error) {
      console.error(error.message);
    }
  };

  return {
    ...transactionMutation,
    isSigned,
    reject: handleReject,
    execute: handleExecute,
    executeAsync: handleExecuteAsync,
    fee: {
      ...feeMutation,
      defaultCurrency: defaultFeeCurrency,
      estimate: handleEstimateFee(),
      setCurrency: handleSetCurrency,
      detailsProps: {
        defaultCurrency: defaultFeeCurrency,
        amount: feeMutation.data?.amount,
        // could possible be undefined, so we want to check for that
        showInsufficientBalance: feeMutation.data?.isValid === false
      }
    }
  };
}

export { useTransaction };
export type { FeeEstimateResult, TransactionResult, UseTransactionOptions, UseTransactionResult };

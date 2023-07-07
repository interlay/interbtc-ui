import { CurrencyExt, LiquidityPool } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { mergeProps } from '@react-aria/utils';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useErrorHandler } from 'react-error-boundary';
import { MutationFunction, useMutation } from 'react-query';
import { useSelector } from 'react-redux';
import { useInterval } from 'react-use';

import { StoreType } from '@/common/types/util.types';
import { GOVERNANCE_TOKEN } from '@/config/relay-chains';
import { useSubstrate } from '@/lib/substrate';
import { REFETCH_INTERVAL } from '@/utils/constants/api';

import { useGetLiquidityPools } from '../api/amm/use-get-liquidity-pools';
import { useGetBalances } from '../api/tokens/use-get-balances';
import { useGetCurrencies } from '../api/use-get-currencies';
import { getExtrinsic, getStatus } from './extrinsics';
import { Transaction, TransactionActions } from './types';
import {
  EstimateFeeVariables,
  FeeEstimateResult,
  PreEstimateVariablesWithType,
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
  const { bridgeLoaded } = useSelector((state: StoreType) => state.general);
  const { state } = useSubstrate();
  const { data: pools } = useGetLiquidityPools();
  const { data: currencies, getCurrencyFromTicker } = useGetCurrencies(bridgeLoaded);
  const { data: balances, getBalance } = useGetBalances();

  const [feeCurrency, setFeeCurrency] = useState(defaultFeeCurrency);

  const { showSuccessModal, customStatus, preEstimate, enablePreEstimate, ...mutateOptions } =
    (typeof typeOrOptions === 'string' ? options : typeOrOptions) || {};

  const feeResultRef = useRef<FeeEstimateResult>();

  const mutateFee: (
    pools: Array<LiquidityPool>
  ) => MutationFunction<FeeEstimateResult, EstimateFeeVariables> = useCallback(
    (pools) => async ({ params, currency }) => {
      const feeBalance = getBalance(currency.ticker)?.transferable;

      // returning undefined means that action amount is not based on fee currency
      const actionAmount = getActionAmount(params, currency);

      const availableBalance = actionAmount ? feeBalance?.sub(actionAmount) : feeBalance;

      const amount = await estimateTransactionFee(currency, pools || [], params);

      const result = {
        amount,
        isValid: !!availableBalance && !!amount && availableBalance.gte(amount)
      };

      feeResultRef.current = result;

      return result;
    },
    [getBalance]
  );

  const { mutate: feeMutate, data, ...feeMutation } = useMutation<
    FeeEstimateResult,
    Error,
    EstimateFeeVariables,
    unknown
  >(mutateFee(pools || []));

  useErrorHandler(feeMutation.error);

  const estimateFeeVariablesRef = useRef<EstimateFeeVariables>();

  const handleEstimateFee = useCallback(
    () => (...args: Parameters<UseTransactionResult<T>['fee']['estimate']>) => {
      const params = getParams(args, typeOrOptions, customStatus);

      const variables = { params, currency: feeCurrency };

      estimateFeeVariablesRef.current = variables;

      feeMutate(variables);
    },
    [typeOrOptions, customStatus, feeCurrency, feeMutate]
  );

  const handleSetCurrency = () => ({ estimate: handleEstimateFee() });

  useEffect(() => {
    const estimate = async () => {
      const estimateArgs = typeof preEstimate === 'function' ? await preEstimate() : preEstimate;

      if (!estimateArgs) return;

      const type = (estimateArgs as PreEstimateVariablesWithType<T>)?.type || typeOrOptions;

      const params = getParams(estimateArgs.args, type, customStatus);

      const variables = { params, currency: feeCurrency };

      estimateFeeVariablesRef.current = variables;

      feeMutate(variables);
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
    feeMutate(estimateFeeVariablesRef.current);
  }, REFETCH_INTERVAL.MINUTE);

  const notifications = useTransactionNotifications({ showSuccessModal });

  const { onSigning, ...optionsProp } = mergeProps(
    mutateOptions,
    {
      onError: (error: Error) => console.error(error.message),
      onSuccess: () => feeMutation.reset()
    },
    notifications.mutationProps
  );

  const { mutate, mutateAsync, ...transactionMutation } = useMutation(
    mutateTransaction(data?.amount, pools || []),
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

    if (error) {
      console.error(error.message);
    }
  };

  const handleFeeSelectionChange = (ticker: string) => {
    const currency = getCurrencyFromTicker(ticker);

    setFeeCurrency(currency);

    const { params } = estimateFeeVariablesRef.current || {};

    if (!params) return;

    const variables = { params, currency };

    estimateFeeVariablesRef.current = variables;

    feeMutate(variables);
  };

  const feeData = data || feeResultRef.current;

  return {
    ...transactionMutation,
    reject: handleReject,
    execute: handleExecute,
    executeAsync: handleExecuteAsync,
    fee: {
      ...feeMutation,
      data: feeData,
      defaultCurrency: defaultFeeCurrency,
      estimate: handleEstimateFee(),
      setCurrency: handleSetCurrency,
      detailsProps: {
        currency: feeCurrency,
        amount: feeData?.amount,
        // could possible be undefined, so we want to check for that
        showInsufficientBalance: feeData?.isValid === false,
        onSelectionChange: handleFeeSelectionChange
      }
    }
  };
}

export { useTransaction };
export type { FeeEstimateResult, TransactionResult, UseTransactionOptions, UseTransactionResult };

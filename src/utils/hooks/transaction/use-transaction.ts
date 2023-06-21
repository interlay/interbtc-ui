import { CurrencyExt, isCurrencyEqual, LiquidityPool } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { mergeProps } from '@react-aria/utils';
import { useCallback, useRef, useState } from 'react';
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
  const finalExtrinsic = wrapWithTxFeeSwap(feeAmount, baseExtrinsic, pools);

  return submitTransaction(window.bridge.api, params.accountAddress, finalExtrinsic, expectedStatus, params.events);
};

// The three declared functions are use to infer types on diferent implementations
function useTransaction<T extends Transaction>(type: T, options?: UseTransactionOptions): UseTransactionWithType<T>;
function useTransaction<T extends Transaction>(options?: UseTransactionOptions): UseTransactionWithoutType<T>;
function useTransaction<T extends Transaction>(
  typeOrOptions?: T | UseTransactionOptions,
  options?: UseTransactionOptions
): UseTransactionResult<T> {
  const { state } = useSubstrate();
  const { data: pools } = useGetLiquidityPools();
  const { getCurrencyFromTicker } = useGetCurrencies(true);
  const { getBalance } = useGetBalances();

  const [isSigned, setSigned] = useState(false);

  const { showSuccessModal, customStatus, ...mutateOptions } =
    (typeof typeOrOptions === 'string' ? options : typeOrOptions) || {};

  const mutateFee: (
    pools: Array<LiquidityPool>
  ) => MutationFunction<FeeEstimateResult, EstimateFeeParams> = useCallback(
    (pools) => async ({ ticker, params }) => {
      const currency = getCurrencyFromTicker(ticker);

      const actionAmount = getActionAmount(params);

      const isActionAmountFeeCurrency = actionAmount && isCurrencyEqual(actionAmount.currency, currency);

      const feeBalance = getBalance(currency.ticker)?.transferable;

      const availableBalance = actionAmount && isActionAmountFeeCurrency ? feeBalance?.sub(actionAmount) : feeBalance;

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

  // Re-estimate fee based on latest stored variables
  useInterval(() => {
    if (!estimateFeeParamsRef.current || feeMutation.isLoading) return;

    feeMutate(estimateFeeParamsRef.current);
  }, REFETCH_INTERVAL.MINUTE);

  const notifications = useTransactionNotifications({ showSuccessModal });

  const handleMutate = () => setSigned(false);

  const handleSigning = () => setSigned(true);

  const handleError = (error: Error) => console.error(error.message);

  const { onSigning, ...optionsProp } = mergeProps(
    mutateOptions,
    {
      onMutate: handleMutate,
      onSigning: handleSigning,
      onError: handleError
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

import { CurrencyExt, isCurrencyEqual, LiquidityPool } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { mergeProps } from '@react-aria/utils';
import { useCallback, useState } from 'react';
import { useErrorHandler } from 'react-error-boundary';
import { MutationFunction, useMutation } from 'react-query';

import { GOVERNANCE_TOKEN } from '@/config/relay-chains';
import { useSubstrate } from '@/lib/substrate';

import { useGetLiquidityPools } from '../api/amm/use-get-liquidity-pools';
import { useGetBalances } from '../api/tokens/use-get-balances';
import { useGetCurrencies } from '../api/use-get-currencies';
import { getExtrinsic, getStatus } from './extrinsics';
import { Transaction, TransactionActions } from './types';
import {
  EstimateArgs,
  EstimateFeeParams,
  EstimateTypeArgs,
  ExecuteArgs,
  ExecuteTypeArgs,
  FeeEstimateResult,
  TransactionResult,
  UseFeeEstimateResult,
  UseTransactionOptions,
  UseTransactionResult
} from './types/hook';
import { useTransactionNotifications } from './use-transaction-notifications';
import { estimateTransactionFee, wrapWithTxFeeSwap } from './utils/fee';
import { getParams } from './utils/params';
import { submitTransaction } from './utils/submit';

const mutateTransaction: (
  feeCurrency: CurrencyExt,
  pools: Array<LiquidityPool>
) => MutationFunction<TransactionResult, TransactionActions> = (feeCurrency, pools) => async (params) => {
  const expectedStatus = params.customStatus || getStatus(params.type);
  const baseExtrinsic = await getExtrinsic(params);
  const feeWrappedExtrinsic = await wrapWithTxFeeSwap(feeCurrency, baseExtrinsic, pools);

  return submitTransaction(window.bridge.api, params.accountAddress, feeWrappedExtrinsic, expectedStatus, params.events);
};

// The three declared functions are use to infer types on diferent implementations
function useTransaction<T extends Transaction>(
  type: T,
  options?: UseTransactionOptions
): Exclude<UseTransactionResult<T>, ExecuteTypeArgs<T> | UseFeeEstimateResult<T>> &
  Exclude<UseFeeEstimateResult<T>, EstimateTypeArgs<T>>;
function useTransaction<T extends Transaction>(
  options?: UseTransactionOptions
): Exclude<UseTransactionResult<T>, ExecuteArgs<T> | UseFeeEstimateResult<T>> &
  Exclude<UseFeeEstimateResult<T>, EstimateArgs<T>>;
function useTransaction<T extends Transaction>(
  typeOrOptions?: T | UseTransactionOptions,
  options?: UseTransactionOptions
): UseTransactionResult<T> {
  const { state } = useSubstrate();

  const [isSigned, setSigned] = useState(false);

  const { showSuccessModal, customStatus, ...mutateOptions } =
    (typeof typeOrOptions === 'string' ? options : typeOrOptions) || {};

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

  // call estimate fee based on pools changes
  const { data: pools } = useGetLiquidityPools();
  const { getCurrencyFromTicker } = useGetCurrencies(true);
  const { getBalance } = useGetBalances();

  const mutateFee: (
    pools: Array<LiquidityPool>
  ) => MutationFunction<FeeEstimateResult, EstimateFeeParams> = useCallback(
    (pools) => async ({ ticker, params }) => {
      const currency = getCurrencyFromTicker(ticker);

      let actionAmount: MonetaryAmount<CurrencyExt> | undefined;

      switch (params.type) {
        case Transaction.TOKENS_TRANSFER: {
          const [, amount] = params.args;
          actionAmount = amount;
          break;
        }
      }

      const actionFeeAmount =
        actionAmount && isCurrencyEqual(actionAmount.currency, currency) ? actionAmount : undefined;

      const feeBalance = getBalance(currency.ticker)?.transferable;

      const availableBalance =
        actionFeeAmount && isCurrencyEqual(actionFeeAmount.currency, currency)
          ? feeBalance?.sub(actionFeeAmount)
          : feeBalance;

      const fee = await estimateTransactionFee(currency, pools || [], params);

      return {
        amount: fee,
        availableBalance,
        currency,
        isValid: !!availableBalance && !!fee && availableBalance.gte(fee)
      };
    },
    [getBalance, getCurrencyFromTicker]
  );

  const { mutate: feeMutate, ...feeMutation } = useMutation<FeeEstimateResult, Error, EstimateFeeParams, unknown>(
    mutateFee(pools || [])
  );

  const handleEstimateFee = useCallback(
    async (...args) => {
      let params = {};
      let ticker: string;

      // Assign correct params for when transaction type is declared on hook params
      if (typeof typeOrOptions === 'string') {
        params = { type: typeOrOptions, args };
        ticker = args[args.length - 1];
      } else {
        // Assign correct params for when transaction type is declared on execution level
        const [type, ...restArgs] = args;
        params = { type, args: restArgs };
        ticker = args[args.length - 1];
      }

      const variables = {
        ...params,
        timestamp: new Date().getTime(),
        customStatus
      } as TransactionActions;

      feeMutate({ ticker, params: variables });
    },
    [typeOrOptions, customStatus, feeMutate]
  );

  const { mutate, mutateAsync, ...transactionMutation } = useMutation(
    mutateTransaction(feeMutation.data?.amount?.currency || GOVERNANCE_TOKEN, pools || []),
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

  useErrorHandler(feeMutation.error);

  return {
    ...transactionMutation,
    isSigned,
    reject: handleReject,
    execute: handleExecute,
    executeAsync: handleExecuteAsync,
    fee: {
      ...feeMutation,
      defaultCurrency: GOVERNANCE_TOKEN,
      estimate: handleEstimateFee
    }
  };
}

export { useTransaction };
export type { FeeEstimateResult, TransactionResult, UseTransactionOptions, UseTransactionResult };

import {
  CurrencyExt,
  CurrencyId,
  ExtrinsicData,
  isCurrencyEqual,
  LiquidityPool,
  MultiPath,
  newCurrencyId
} from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { ExtrinsicStatus } from '@polkadot/types/interfaces';
import { ISubmittableResult } from '@polkadot/types/types';
import { mergeProps } from '@react-aria/utils';
import { useCallback, useState } from 'react';
import { MutationFunction, useMutation, UseMutationOptions, UseMutationResult } from 'react-query';

import { GOVERNANCE_TOKEN, RELAY_CHAIN_NATIVE_TOKEN } from '@/config/relay-chains';
import { useSubstrate } from '@/lib/substrate';

import { getExtrinsic, getStatus } from './extrinsics';
import { Transaction, TransactionActions, TransactionArgs } from './types';
import { useTransactionNotifications } from './use-transaction-notifications';
import { submitTransaction } from './utils/submit';

type TransactionResult = { status: 'success' | 'error'; data: ISubmittableResult; error?: Error };

// TODO: add feeEstimate and feeEstimateAsync
type ExecuteArgs<T extends Transaction> = {
  // Executes the transaction
  execute<D extends Transaction = T>(...args: TransactionArgs<D>): void;
  // Similar to execute but returns a promise which can be awaited.
  executeAsync<D extends Transaction = T>(...args: TransactionArgs<D>): Promise<TransactionResult>;
};

// TODO: add feeEstimate and feeEstimateAsync
type ExecuteTypeArgs<T extends Transaction> = {
  execute<D extends Transaction = T>(type: D, ...args: TransactionArgs<D>): void;
  executeAsync<D extends Transaction = T>(type: D, ...args: TransactionArgs<D>): Promise<TransactionResult>;
};

type ExecuteFunctions<T extends Transaction> = ExecuteArgs<T> | ExecuteTypeArgs<T>;

type ReactQueryUseMutationResult = Omit<
  UseMutationResult<TransactionResult, Error, TransactionActions, unknown>,
  'mutate' | 'mutateAsync'
>;

type UseTransactionResult<T extends Transaction> = {
  reject: (error?: Error) => void;
  isSigned: boolean;
} & ReactQueryUseMutationResult &
  ExecuteFunctions<T>;

const reverseSwapPath = (path: MultiPath): Array<CurrencyId> => {
  const reversedPath = path.reverse();
  const inputCurrency = newCurrencyId(window.bridge.api, reversedPath[0].output);
  const result: Array<CurrencyId> = [inputCurrency];
  for (const { input } of reversedPath) {
    result.push(newCurrencyId(window.bridge.api, input));
  }
  return result;
};

const computeOptimalInputAmount = (
  minOutputAmount: MonetaryAmount<CurrencyExt>,
  inputAmount: MonetaryAmount<CurrencyExt>,
  pools: Array<LiquidityPool>
): MonetaryAmount<CurrencyExt> => {
  const controlTrade = window.bridge.amm.getOptimalTrade(inputAmount, minOutputAmount.currency, pools);
  if (controlTrade?.outputAmount.lt(minOutputAmount)) {
    // If the output amount is lower than txFee double the input currency amount and check again.
    return computeOptimalInputAmount(minOutputAmount, inputAmount.mul(2), pools);
  }
  return inputAmount;
};

const wrapWithTxFeeSwap = async (
  feeCurrency: CurrencyExt,
  baseExtrinsicData: ExtrinsicData
): Promise<ExtrinsicData> => {
  if (isCurrencyEqual(feeCurrency, GOVERNANCE_TOKEN)) {
    return baseExtrinsicData;
  }
  // TODO: Refactor (maybe parametrize) this after txFee estimation work is done.
  const [nativeTxFee, pools] = await Promise.all([
    window.bridge.transaction.getFeeEstimate(baseExtrinsicData.extrinsic),
    window.bridge.amm.getLiquidityPools()
  ]);

  const reverseDirectionTrade = window.bridge.amm.getOptimalTrade(nativeTxFee, feeCurrency, pools);
  if (reverseDirectionTrade === null) {
    // TODO: handle - trade path not found, not possible to do the swap
    throw new Error();
  }

  const inputAmount = computeOptimalInputAmount(nativeTxFee, reverseDirectionTrade.outputAmount, pools);
  const path = reverseSwapPath(reverseDirectionTrade.path);
  const wrappedCall = window.bridge.api.tx.multiTransactionPayment.withFeeSwapPath(
    path,
    inputAmount.toString(true),
    baseExtrinsicData.extrinsic
  );

  return { extrinsic: wrappedCall };
};

const mutateTransaction: (feeCurrency?: CurrencyExt) => MutationFunction<TransactionResult, TransactionActions> = (
  feeCurrency
) => async (params) => {
  const expectedStatus = params.customStatus || getStatus(params.type);
  const baseExtrinsic = await getExtrinsic(params);
  // If fee currency is specified wrap the extrinsic in `withFeeSwapPath` call.
  const finalExtrinsic =
    feeCurrency === undefined ? baseExtrinsic : await wrapWithTxFeeSwap(feeCurrency, baseExtrinsic);

  return submitTransaction(window.bridge.api, params.accountAddress, finalExtrinsic, expectedStatus, params.events);
};

type UseTransactionOptions = Omit<
  UseMutationOptions<TransactionResult, Error, TransactionActions, unknown>,
  'mutationFn'
> & {
  customStatus?: ExtrinsicStatus['type'];
  onSigning?: (variables: TransactionActions) => void;
  showSuccessModal?: boolean;
  feeCurrency?: CurrencyExt;
};

// The three declared functions are use to infer types on diferent implementations
function useTransaction<T extends Transaction>(
  type: T,
  options?: UseTransactionOptions
): Exclude<UseTransactionResult<T>, ExecuteTypeArgs<T>>;
function useTransaction<T extends Transaction>(
  options?: UseTransactionOptions
): Exclude<UseTransactionResult<T>, ExecuteArgs<T>>;
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

  const { mutate, mutateAsync, ...transactionMutation } = useMutation(
    mutateTransaction(RELAY_CHAIN_NATIVE_TOKEN),
    optionsProp
  );

  // Handles params for both type of implementations
  const getParams = useCallback(
    (args: Parameters<UseTransactionResult<T>['execute']>) => {
      let params = {};

      // Assign correct params for when transaction type is declared on hook params
      if (typeof typeOrOptions === 'string') {
        params = { type: typeOrOptions, args };
      } else {
        // Assign correct params for when transaction type is declared on execution level
        const [type, ...restArgs] = args;
        params = { type, args: restArgs };
      }

      // Execution should only ran when authenticated
      const accountAddress = state.selectedAccount?.address;

      const variables = {
        ...params,
        accountAddress,
        timestamp: new Date().getTime(),
        customStatus
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
      const params = getParams(args);

      return mutate(params);
    },
    [getParams, mutate]
  );

  const handleExecuteAsync = useCallback(
    (...args: Parameters<UseTransactionResult<T>['executeAsync']>) => {
      const params = getParams(args);

      return mutateAsync(params);
    },
    [getParams, mutateAsync]
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
    executeAsync: handleExecuteAsync
  };
}

export { useTransaction };
export type { TransactionResult, UseTransactionResult };

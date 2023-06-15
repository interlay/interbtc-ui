import {
  CurrencyExt,
  CurrencyId,
  ExtrinsicData,
  isCurrencyEqual,
  LiquidityPool,
  MultiPath,
  newCurrencyId,
  Trade
} from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { SubmittableExtrinsic } from '@polkadot/api/types';
import { ExtrinsicStatus } from '@polkadot/types/interfaces';
import { ISubmittableResult } from '@polkadot/types/types';
import { mergeProps } from '@react-aria/utils';
import { useCallback, useState } from 'react';
import { MutationFunction, useMutation, UseMutationOptions, UseMutationResult } from 'react-query';

import { GOVERNANCE_TOKEN } from '@/config/relay-chains';
import { useSubstrate } from '@/lib/substrate';

import { useGetLiquidityPools } from '../api/amm/use-get-liquidity-pools';
import { getExtrinsic, getStatus } from './extrinsics';
import { Transaction, TransactionActions, TransactionArgs } from './types';
import { useTransactionNotifications } from './use-transaction-notifications';
import { submitTransaction } from './utils/submit';

type TransactionResult = { status: 'success' | 'error'; data: ISubmittableResult; error?: Error };

type ExecuteArgs<T extends Transaction> = {
  // Executes the transaction
  execute<D extends Transaction = T>(...args: TransactionArgs<D>): void;
  // Similar to execute but returns a promise which can be awaited.
  executeAsync<D extends Transaction = T>(...args: TransactionArgs<D>): Promise<TransactionResult>;
  estimateFee<D extends Transaction = T>(...args: TransactionArgs<D>): Promise<MonetaryAmount<CurrencyExt>>;
};

type ExecuteTypeArgs<T extends Transaction> = {
  execute<D extends Transaction = T>(type: D, ...args: TransactionArgs<D>): void;
  executeAsync<D extends Transaction = T>(type: D, ...args: TransactionArgs<D>): Promise<TransactionResult>;
  estimateFee<D extends Transaction = T>(type: D, ...args: TransactionArgs<D>): Promise<MonetaryAmount<CurrencyExt>>;
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

const constructSwapPathPrimitive = (path: MultiPath): Array<CurrencyId> => {
  const inputCurrency = newCurrencyId(window.bridge.api, path[0].input);
  return [inputCurrency, ...path.map(({ output }) => newCurrencyId(window.bridge.api, output))];
};

// Recursively double input amount until the trade with higher than minimum output
// amount is found.
const getOptimalTradeForTxFeeSwap = (
  minOutputAmount: MonetaryAmount<CurrencyExt>,
  inputAmount: MonetaryAmount<CurrencyExt>,
  pools: Array<LiquidityPool>
): Trade => {
  const trade = window.bridge.amm.getOptimalTrade(inputAmount, minOutputAmount.currency, pools);
  if (trade === null) {
    // TODO: handle - trade path not found, not possible to do the swap
    throw new Error();
  }
  if (trade?.outputAmount.lt(minOutputAmount)) {
    // If the output amount is lower than txFee double the input currency amount and check again.
    return getOptimalTradeForTxFeeSwap(minOutputAmount, inputAmount.mul(2), pools);
  }
  return trade;
};

const getTxFeeSwapData = async (
  nativeTxFee: MonetaryAmount<CurrencyExt>,
  feeCurrency: CurrencyExt,
  baseExtrinsic: SubmittableExtrinsic<'promise'>,
  pools: Array<LiquidityPool>
): Promise<{ swapPathPrimitive: Array<CurrencyId>; inputAmount: MonetaryAmount<CurrencyExt> }> => {
  // First we construct reverse direction trade to get estimated swap path and amount
  const reverseDirectionTrade = window.bridge.amm.getOptimalTrade(nativeTxFee, feeCurrency, pools);
  if (reverseDirectionTrade === null) {
    // TODO: handle - trade path not found, not possible to do the swap
    throw new Error();
  }
  // Final native token transaction fee is estimated for base extrinsic wrapped in multiTransactionPayment call.
  // NOTE: We assume here the reverse direction trade has similar weight.
  const reverseDirectionExtrinsic = window.bridge.api.tx.multiTransactionPayment.withFeeSwapPath(
    constructSwapPathPrimitive(reverseDirectionTrade.path),
    reverseDirectionTrade.outputAmount.toString(true),
    baseExtrinsic
  );
  const withSwapTxFee = await window.bridge.transaction.getFeeEstimate(reverseDirectionExtrinsic);
  const { inputAmount, path } = getOptimalTradeForTxFeeSwap(
    withSwapTxFee.mul(1.5),
    reverseDirectionTrade.outputAmount,
    pools
  );
  const swapPathPrimitive = constructSwapPathPrimitive(path);

  return { inputAmount, swapPathPrimitive };
};

const getTransactionFee: (
  feeCurrency: CurrencyExt,
  pools: Array<LiquidityPool>
) => (params: TransactionActions) => Promise<MonetaryAmount<CurrencyExt>> = (feeCurrency, pools) => async (params) => {
  const baseExtrinsicData = await getExtrinsic(params);
  const nativeTxFee = await window.bridge.transaction.getFeeEstimate(baseExtrinsicData.extrinsic);

  if (isCurrencyEqual(feeCurrency, GOVERNANCE_TOKEN)) {
    return nativeTxFee;
  }

  const { inputAmount: swapTxFee } = await getTxFeeSwapData(
    nativeTxFee,
    feeCurrency,
    baseExtrinsicData.extrinsic,
    pools
  );

  return swapTxFee;
};

const wrapWithTxFeeSwap = async (
  feeCurrency: CurrencyExt,
  baseExtrinsicData: ExtrinsicData,
  pools: Array<LiquidityPool>
): Promise<ExtrinsicData> => {
  if (isCurrencyEqual(feeCurrency, GOVERNANCE_TOKEN)) {
    return baseExtrinsicData;
  }
  const nativeTxFee = await window.bridge.transaction.getFeeEstimate(baseExtrinsicData.extrinsic);

  const { swapPathPrimitive, inputAmount } = await getTxFeeSwapData(
    nativeTxFee,
    feeCurrency,
    baseExtrinsicData.extrinsic,
    pools
  );
  const wrappedCall = window.bridge.api.tx.multiTransactionPayment.withFeeSwapPath(
    swapPathPrimitive,
    inputAmount.toString(true),
    baseExtrinsicData.extrinsic
  );
  console.log(wrappedCall.toHex());
  return { extrinsic: wrappedCall };
};

const mutateTransaction: (
  feeCurrency: CurrencyExt,
  pools: Array<LiquidityPool>
) => MutationFunction<TransactionResult, TransactionActions> = (feeCurrency, pools) => async (params) => {
  const expectedStatus = params.customStatus || getStatus(params.type);
  const baseExtrinsic = await getExtrinsic(params);
  // If fee currency is specified wrap the extrinsic in `withFeeSwapPath` call.
  const finalExtrinsic =
    feeCurrency === undefined ? baseExtrinsic : await wrapWithTxFeeSwap(feeCurrency, baseExtrinsic, pools);

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

  const { data: pools } = useGetLiquidityPools();

  const { mutate, mutateAsync, ...transactionMutation } = useMutation(
    mutateTransaction(options?.feeCurrency || GOVERNANCE_TOKEN, pools || []),
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

  const handleEstimateFee = useCallback(
    (...args: Parameters<UseTransactionResult<T>['estimateFee']>) => {
      const params = getParams(args);

      return getTransactionFee(options?.feeCurrency || GOVERNANCE_TOKEN, pools || [])(params);
    },
    [options?.feeCurrency, pools, getParams]
  );

  return {
    ...transactionMutation,
    isSigned,
    reject: handleReject,
    execute: handleExecute,
    executeAsync: handleExecuteAsync,
    estimateFee: handleEstimateFee
  };
}

export { useTransaction };
export type { TransactionResult, UseTransactionResult };

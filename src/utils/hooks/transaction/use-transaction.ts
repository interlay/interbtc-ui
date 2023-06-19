import { CurrencyExt, LiquidityPool } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { ExtrinsicStatus } from '@polkadot/types/interfaces';
import { ISubmittableResult } from '@polkadot/types/types';
import { mergeProps } from '@react-aria/utils';
import { useCallback, useState } from 'react';
import { MutationFunction, useMutation, UseMutationOptions, UseMutationResult } from 'react-query';

import { useSubstrate } from '@/lib/substrate';

import { useGetLiquidityPools } from '../api/amm/use-get-liquidity-pools';
import { getExtrinsic, getStatus } from './extrinsics';
import { Transaction, TransactionActions, TransactionArgs } from './types';
import { useFeeEstimate, UseFeeEstimateResult } from './use-fee-estimate';
import { useTransactionNotifications } from './use-transaction-notifications';
import { wrapWithTxFeeSwap } from './utils/fee';
import { getParams } from './utils/params';
import { submitTransaction } from './utils/submit';

type TransactionResult = { status: 'success' | 'error'; data: ISubmittableResult; error?: Error };

type ExecuteArgs<T extends Transaction> = {
  // Executes the transaction
  execute<D extends Transaction = T>(...args: TransactionArgs<D>): void;
  // Similar to execute but returns a promise which can be awaited.
  executeAsync<D extends Transaction = T>(...args: TransactionArgs<D>): Promise<TransactionResult>;
};

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
  fee: UseFeeEstimateResult<T>;
} & ReactQueryUseMutationResult &
  ExecuteFunctions<T>;

const mutateTransaction: (
  feeCurrency: CurrencyExt,
  pools: Array<LiquidityPool>
) => MutationFunction<TransactionResult, TransactionActions> = (feeCurrency, pools) => async (params) => {
  const expectedStatus = params.customStatus || getStatus(params.type);
  const baseExtrinsic = await getExtrinsic(params);
  const feeWrappedExtrinsic = await wrapWithTxFeeSwap(feeCurrency, baseExtrinsic, pools);

  return submitTransaction(window.bridge.api, params.accountAddress, feeWrappedExtrinsic, expectedStatus, params.events);
};

type UseTransactionOptions = Omit<
  UseMutationOptions<TransactionResult, Error, TransactionActions, unknown>,
  'mutationFn'
> & {
  customStatus?: ExtrinsicStatus['type'];
  onSigning?: (variables: TransactionActions) => void;
  onChangeFeeEstimate?: (fee?: MonetaryAmount<CurrencyExt>) => void;
  showSuccessModal?: boolean;
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

  const { onSigning, onChangeFeeEstimate, ...optionsProp } = mergeProps(
    mutateOptions,
    {
      onMutate: handleMutate,
      onSigning: handleSigning,
      onError: handleError
    },
    notifications.mutationProps
  );

  const { data: pools } = useGetLiquidityPools();

  const fee = useFeeEstimate(
    typeof typeOrOptions === 'string'
      ? (typeOrOptions as T)
      : ({ customStatus: customStatus, onChangeFeeEstimate } as any),
    {
      customStatus,
      onChangeFeeEstimate
    }
  );

  const { mutate, mutateAsync, ...transactionMutation } = useMutation(
    mutateTransaction(fee.currency, pools || []),
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
    fee
  };
}

export { useTransaction };
export type { ExecuteFunctions, TransactionResult, UseTransactionOptions, UseTransactionResult };

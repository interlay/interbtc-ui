import { ExtrinsicStatus } from '@polkadot/types/interfaces';
import { ISubmittableResult } from '@polkadot/types/types';
import { mergeProps } from '@react-aria/utils';
import { useCallback, useState } from 'react';
import { MutationFunction, useMutation, UseMutationOptions, UseMutationResult } from 'react-query';

import { useSubstrate } from '@/lib/substrate';

import { Transaction, TransactionActions, TransactionArgs } from './types';
import { useTransactionNotifications } from './use-transaction-notifications';
import { getExtrinsic, getStatus } from './utils/extrinsic';
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

// TODO: handle dispatchError from lib
const mutateTransaction: MutationFunction<TransactionResult, TransactionActions> = async (params) => {
  const extrinsics = await getExtrinsic(params);
  const expectedStatus = params.customStatus || getStatus(params.type);

  return submitTransaction(window.bridge.api, params.accountAddress, extrinsics, expectedStatus, params.events);
};

type UseTransactionOptions = Omit<
  UseMutationOptions<TransactionResult, Error, TransactionActions, unknown>,
  'mutationFn'
> & {
  customStatus?: ExtrinsicStatus['type'];
  onSigning?: (variables: TransactionActions) => void;
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

  const notifications = useTransactionNotifications();

  const handleMutate = () => setSigned(false);

  const handleSigning = () => setSigned(true);

  const handleError = (error: Error) => console.error(error.message);

  const { onSigning, ...optionsProp } = mergeProps(
    (typeof typeOrOptions === 'string' ? options : typeOrOptions) || {},
    {
      onMutate: handleMutate,
      onSigning: handleSigning,
      onError: handleError
    },
    notifications.mutationProps
  );

  const { mutate, mutateAsync, ...transactionMutation } = useMutation(mutateTransaction, optionsProp);

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
        customStatus: options?.customStatus
      } as TransactionActions;

      return {
        ...variables,
        events: {
          onReady: () => onSigning(variables)
        }
      };
    },
    [onSigning, options?.customStatus, state.selectedAccount?.address, typeOrOptions]
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

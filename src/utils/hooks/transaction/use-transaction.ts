import { ExtrinsicStatus } from '@polkadot/types/interfaces';
import { ISubmittableResult } from '@polkadot/types/types';
import { useCallback } from 'react';
import { MutationFunction, useMutation, UseMutationOptions, UseMutationResult } from 'react-query';

import { useSubstrate } from '@/lib/substrate';

import { Transaction, TransactionActions, TransactionArgs } from './types';
import { getExtrinsic, getStatus } from './utils/extrinsic';
import { submitTransaction } from './utils/submit';

type UseTransactionOptions = Omit<
  UseMutationOptions<ISubmittableResult, Error, TransactionActions, unknown>,
  'mutationFn'
> & {
  customStatus?: ExtrinsicStatus['type'];
};

// TODO: add feeEstimate and feeEstimateAsync
type ExecuteArgs<T extends Transaction> = {
  execute<D extends Transaction = T>(...args: TransactionArgs<D>): void;
  executeAsync<D extends Transaction = T>(...args: TransactionArgs<D>): Promise<ISubmittableResult>;
};

// TODO: add feeEstimate and feeEstimateAsync
type ExecuteTypeArgs<T extends Transaction> = {
  execute<D extends Transaction = T>(type: D, ...args: TransactionArgs<D>): void;
  executeAsync<D extends Transaction = T>(type: D, ...args: TransactionArgs<D>): Promise<ISubmittableResult>;
};

type InheritAttrs = Omit<
  UseMutationResult<ISubmittableResult, Error, TransactionActions, unknown>,
  'mutate' | 'mutateAsync'
>;

type UseTransactionResult<T extends Transaction> = InheritAttrs & (ExecuteArgs<T> | ExecuteTypeArgs<T>);

const mutateTransaction: MutationFunction<ISubmittableResult, TransactionActions> = async (params) => {
  const extrinsics = await getExtrinsic(params);
  const expectedStatus = params.customStatus || getStatus(params.type);

  return submitTransaction(window.bridge.api, params.accountAddress, extrinsics, expectedStatus, params.events);
};

// The three declared functions are use to infer types on diferent implementations
// TODO: missing xcm transaction
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

  const hasOnlyOptions = typeof typeOrOptions !== 'string';

  const { mutate, mutateAsync, ...transactionMutation } = useMutation(
    mutateTransaction,
    (hasOnlyOptions ? typeOrOptions : options) as UseTransactionOptions
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

      // TODO: add event `onReady`
      return {
        ...params,
        accountAddress,
        customStatus: options?.customStatus
      } as TransactionActions;
    },
    [options?.customStatus, state.selectedAccount?.address, typeOrOptions]
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

  return {
    ...transactionMutation,
    execute: handleExecute,
    executeAsync: handleExecuteAsync
  };
}

export { useTransaction };
export type { UseTransactionResult };

import { ISubmittableResult } from '@polkadot/types/types';
import { useCallback } from 'react';
import { MutationFunction, useMutation, UseMutationOptions, UseMutationResult } from 'react-query';

import { useSubstrate } from '@/lib/substrate';

import { Transaction, TransactionActions, TransactionArgs } from './types';
import { getExpectedStatus, getExtrinsic } from './utils/extrinsic';
import { submitTransaction } from './utils/submit';

type UseTransactionOptions = Omit<
  UseMutationOptions<ISubmittableResult, Error, TransactionActions, unknown>,
  'mutationFn'
>;

type UseTransactionCommonResult = Omit<
  UseMutationResult<ISubmittableResult, Error, TransactionActions, unknown>,
  'mutate'
>;

type UseTransactionArgsResult<T extends Transaction> = UseTransactionCommonResult & {
  execute<D extends Transaction = T>(...args: TransactionArgs<D>): void;
};

type UseTransactionTypeResult<T extends Transaction> = UseTransactionCommonResult & {
  execute<D extends Transaction = T>(type: D, ...args: TransactionArgs<D>): void;
};

type UseTransactionResult<T extends Transaction> = UseTransactionArgsResult<T> | UseTransactionTypeResult<T>;

const mutateTransaction: MutationFunction<ISubmittableResult, TransactionActions> = async (params) => {
  const extrinsics = await getExtrinsic(params);
  const expectedStatus = getExpectedStatus(params.type);

  return submitTransaction(window.bridge.api, params.accountAddress, extrinsics, expectedStatus, params.events);
};

function useTransaction<T extends Transaction>(type: T, options?: UseTransactionOptions): UseTransactionArgsResult<T>;
function useTransaction<T extends Transaction>(options: UseTransactionOptions): UseTransactionTypeResult<T>;
function useTransaction<T extends Transaction>(
  type: T | UseTransactionOptions,
  options?: UseTransactionOptions
): UseTransactionResult<T> {
  const { state } = useSubstrate();

  const { mutate, ...transactionMutation } = useMutation(mutateTransaction, options || {});

  const handleExecute = useCallback(
    (...args: Parameters<UseTransactionResult<T>['execute']>) => {
      const accountAddress = state.selectedAccount?.address;

      if (!accountAddress) {
        return undefined;
      }

      const [typeOrArg, ...rest] = args;

      const params = typeof type === 'string' ? { type, args } : { type: typeOrArg, args: rest };

      // TODO: add event `onSigning`
      return mutate({
        ...params,
        accountAddress
      } as TransactionActions);
    },
    [mutate, state.selectedAccount?.address, type]
  );

  return {
    ...transactionMutation,
    execute: handleExecute as any
  };
}

export { useTransaction };

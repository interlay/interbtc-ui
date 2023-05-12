import { ISubmittableResult } from '@polkadot/types/types';
import { useCallback } from 'react';
import { MutationFunction, useMutation, UseMutationOptions, UseMutationResult } from 'react-query';

import { useSubstrate } from '@/lib/substrate';

import { submitTransaction } from './submit';
import { Transaction, TransactionActions, TransactionArgs } from './types';
import { getExpectedStatus, getExtrinsic } from './utils';

type UseTransactionOptions = Omit<
  UseMutationOptions<ISubmittableResult, Error, TransactionActions, unknown>,
  'mutationFn'
>;

type UseTransactionResult<T extends Transaction> = Omit<
  UseMutationResult<ISubmittableResult, unknown, TransactionActions, unknown>,
  'mutate'
> & {
  execute: (...args: TransactionArgs<T>) => void;
};

const mutateTransaction: MutationFunction<ISubmittableResult, TransactionActions> = async (params) => {
  const extrinsics = await getExtrinsic(params);
  const status = getExpectedStatus(params.type);

  return submitTransaction(window.bridge.api, params.accountAddress, extrinsics, status, params.events);
};

const useTransaction = <T extends Transaction>(type: T, options?: UseTransactionOptions): UseTransactionResult<T> => {
  const { state } = useSubstrate();

  const { mutate, ...transactionMutation } = useMutation(mutateTransaction, options || {});

  const handleExecute = useCallback(
    (...args: TransactionArgs<T>) => {
      const accountAddress = state.selectedAccount?.address;

      if (!accountAddress) {
        return undefined;
      }

      // TODO: add events
      return mutate({
        type,
        args,
        accountAddress
      } as TransactionActions);
    },
    [mutate, state.selectedAccount?.address, type]
  );

  return {
    ...transactionMutation,
    execute: handleExecute as any
  };
};

export { useTransaction };

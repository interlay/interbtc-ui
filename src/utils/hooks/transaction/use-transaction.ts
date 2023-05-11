import { ExtrinsicData } from '@interlay/interbtc-api';
import { Currency, MonetaryAmount } from '@interlay/monetary-js';
import { ExtrinsicStatus } from '@polkadot/types/interfaces';
import { ISubmittableResult } from '@polkadot/types/types';
import { MutationFunction, useMutation, UseMutationOptions, UseMutationResult } from 'react-query';

import { useSubstrate } from '@/lib/substrate';

import { submitTransaction } from './submit';
import { Transaction, TransactionActions } from './types';

type PrepareResult = { extrinsics: ExtrinsicData; fee: MonetaryAmount<Currency> };

type TransactionArgs<T extends Transaction> = Extract<TransactionActions, { type: T }>['args'];

type UseTransactionOptions = Omit<
  UseMutationOptions<ISubmittableResult, unknown, TransactionActions, unknown>,
  'mutationFn'
> & {
  prepare?: Omit<UseMutationOptions<PrepareResult, unknown, TransactionActions, unknown>, 'mutationFn'>;
};

const getExtrinsic = (params: TransactionActions) => {
  switch (params.type) {
    case Transaction.SWAP: {
      return window.bridge.amm.swap(...params.args);
    }
    case Transaction.POOL_ADD_LIQUIDITY: {
      return window.bridge.amm.addLiquidity(...params.args);
    }
  }
};

const getExpectedStatus = (type: Transaction): ExtrinsicStatus['type'] => {
  switch (type) {
    // some transactions will need Finalized Status
    default:
      return 'InBlock';
  }
};

const transactionMutation: MutationFunction<ISubmittableResult, TransactionActions> = async (params) => {
  const extrinsics = getExtrinsic(params);

  if (!extrinsics) {
    throw new Error('Something went wrong');
  }

  const status = getExpectedStatus(params.type);

  return submitTransaction(
    window.bridge.api,
    params.address,
    extrinsics.extrinsic,
    { onSigning: () => console.log('signed') },
    status
  );
};

const mutateFee: MutationFunction<PrepareResult, TransactionActions> = async (params) => {
  const extrinsics = getExtrinsic(params);

  const fee = await window.bridge.transaction.getFeeEstimate(extrinsics.extrinsic);

  return { extrinsics, fee };
};

type UseTransactionResult<T extends Transaction> = Omit<
  UseMutationResult<ISubmittableResult, unknown, TransactionActions, unknown>,
  'mutate'
> & {
  // TODO: remove optional and add implementation
  prepare: (...args: TransactionArgs<T>) => void;
  execute: (...args: TransactionArgs<T>) => void;
  fee: Omit<UseMutationResult<PrepareResult, unknown, TransactionActions, unknown>, 'mutate'>;
};

const useTransaction = <T extends Transaction>(type: T, options?: UseTransactionOptions): UseTransactionResult<T> => {
  const { state } = useSubstrate();
  const prepareMutation = useMutation(mutateFee, options?.prepare);

  const mutation = useMutation(transactionMutation, options || {});

  return {
    ...mutation,
    fee: prepareMutation,
    prepare: ((...args: TransactionArgs<T>) =>
      mutation.mutate({
        type,
        args,
        timestamp: new Date().getTime()
      } as TransactionActions)) as any,
    // asserting this to `any` due to complex type error
    execute: ((...args: TransactionArgs<T>) =>
      mutation.mutate({
        type,
        args,
        address: state.selectedAccount?.address,
        timestamp: new Date().getTime()
      } as TransactionActions)) as any
  };
};

export { useTransaction };

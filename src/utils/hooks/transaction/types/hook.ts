import { CurrencyExt } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { ExtrinsicStatus } from '@polkadot/types/interfaces';
import { ISubmittableResult } from '@polkadot/types/types';
import { UseMutationOptions, UseMutationResult } from 'react-query';

import { EstimateArgs, EstimateTypeArgs, FeeEstimateResult, UseFeeEstimateResult } from '../hooks/use-fee-estimate';
import { Transaction, TransactionActions, TransactionArgs } from '.';

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

type ReactQueryUseTransactionResult = Omit<
  UseMutationResult<TransactionResult, Error, TransactionActions, unknown>,
  'mutate' | 'mutateAsync'
>;

type UseTransactionResult<T extends Transaction> = {
  reject: (error?: Error) => void;
  fee: UseFeeEstimateResult<T>;
  calculateFeeAffectAmount: (
    amount: MonetaryAmount<CurrencyExt>,
    feeData?: FeeEstimateResult
  ) => MonetaryAmount<CurrencyExt>;
} & ReactQueryUseTransactionResult &
  ExecuteFunctions<T>;

type UseTransactionCommonOptions = {
  customStatus?: ExtrinsicStatus['type'];
  onSigning?: (variables: TransactionActions) => void;
  onFeeChange?: (data: FeeEstimateResult) => void;
  showSuccessModal?: boolean;
};

type UseTransactionOptionsWithType = Omit<
  UseMutationOptions<TransactionResult, Error, TransactionActions, unknown>,
  'mutationFn'
> &
  UseTransactionCommonOptions;

type UseTransactionOptionsWithoutType = Omit<
  UseMutationOptions<TransactionResult, Error, TransactionActions, unknown>,
  'mutationFn'
> &
  UseTransactionCommonOptions;

type UseTransactionOptions = Omit<
  UseMutationOptions<TransactionResult, Error, TransactionActions, unknown>,
  'mutationFn'
> &
  UseTransactionCommonOptions;

type UseTransactionWithType<T extends Transaction> = Omit<
  Exclude<UseTransactionResult<T>, ExecuteTypeArgs<T>>,
  'fee'
> & {
  fee: Exclude<UseFeeEstimateResult<T>, EstimateTypeArgs<T>>;
};

type UseTransactionWithoutType<T extends Transaction> = Omit<
  Exclude<UseTransactionResult<T>, ExecuteArgs<T>>,
  'fee'
> & {
  fee: Exclude<UseFeeEstimateResult<T>, EstimateArgs<T>>;
};

export type {
  EstimateArgs,
  EstimateTypeArgs,
  ExecuteArgs,
  ExecuteFunctions,
  ExecuteTypeArgs,
  TransactionResult,
  UseFeeEstimateResult,
  UseTransactionOptions,
  UseTransactionOptionsWithoutType,
  UseTransactionOptionsWithType,
  UseTransactionResult,
  UseTransactionWithoutType,
  UseTransactionWithType
};

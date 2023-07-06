import { CurrencyExt } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { ExtrinsicStatus } from '@polkadot/types/interfaces';
import { ISubmittableResult } from '@polkadot/types/types';
import { UseMutationOptions, UseMutationResult } from 'react-query';

import { Transaction, TransactionActions, TransactionArgs } from '.';

type FeeEstimateResult = {
  amount?: MonetaryAmount<CurrencyExt>;
  isValid?: boolean;
};

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

type EstimateArgs<T extends Transaction> = {
  estimate<D extends Transaction = T>(...args: TransactionArgs<D>): void;
  setCurrency(ticker?: string): { estimate<D extends Transaction = T>(...args: TransactionArgs<D>): void };
};

type EstimateTypeArgs<T extends Transaction> = {
  estimate<D extends Transaction = T>(type: D, ...args: TransactionArgs<D>): void;
  setCurrency(ticker?: string): { estimate<D extends Transaction = T>(type: D, ...args: TransactionArgs<D>): void };
};

type EstimateFunctions<T extends Transaction> = EstimateArgs<T> | EstimateTypeArgs<T>;

type EstimateFeeParams = TransactionActions;

type ReactQueryUseFeeEstimateResult = Omit<
  UseMutationResult<FeeEstimateResult, Error, EstimateFeeParams, unknown>,
  'mutate' | 'mutateAsync'
>;

type UseFeeEstimateResult<T extends Transaction> = {
  defaultCurrency: CurrencyExt;
  detailsProps: {
    currency: CurrencyExt;
    amount?: MonetaryAmount<CurrencyExt>;
    showInsufficientBalance?: boolean;
    onSelectionChange: (ticker: string) => void;
  };
} & ReactQueryUseFeeEstimateResult &
  EstimateFunctions<T>;

type ReactQueryUseTransactionResult = Omit<
  UseMutationResult<TransactionResult, Error, TransactionActions, unknown>,
  'mutate' | 'mutateAsync'
>;

type UseTransactionResult<T extends Transaction> = {
  reject: (error?: Error) => void;
  isSigned: boolean;
  fee: UseFeeEstimateResult<T>;
} & ReactQueryUseTransactionResult &
  ExecuteFunctions<T>;

type PrefetchFeeEstimateHanlderWithType<T extends Transaction> = { type: T; args: TransactionArgs<T> };
type PrefetchFeeEstimateHanlderWithoutType<T extends Transaction> = { args: TransactionArgs<T> };

type UseTransactionOptionsWithType<T extends Transaction> = Omit<
  UseMutationOptions<TransactionResult, Error, TransactionActions, unknown>,
  'mutationFn'
> & {
  customStatus?: ExtrinsicStatus['type'];
  onSigning?: (variables: TransactionActions) => void;
  prefetchFee?: PrefetchFeeEstimateHanlderWithType<T>;
  showSuccessModal?: boolean;
};

type UseTransactionOptionsWithoutType<T extends Transaction> = Omit<
  UseMutationOptions<TransactionResult, Error, TransactionActions, unknown>,
  'mutationFn'
> & {
  customStatus?: ExtrinsicStatus['type'];
  onSigning?: (variables: TransactionActions) => void;
  prefetchFee?: PrefetchFeeEstimateHanlderWithoutType<T>;
  showSuccessModal?: boolean;
};

type UseTransactionOptions<T extends Transaction> = Omit<
  UseMutationOptions<TransactionResult, Error, TransactionActions, unknown>,
  'mutationFn'
> & {
  customStatus?: ExtrinsicStatus['type'];
  onSigning?: (variables: TransactionActions) => void;
  prefetchFee?: PrefetchFeeEstimateHanlderWithType<T> | PrefetchFeeEstimateHanlderWithoutType<T>;
  showSuccessModal?: boolean;
};

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
  EstimateFeeParams,
  EstimateFunctions,
  EstimateTypeArgs,
  ExecuteArgs,
  ExecuteFunctions,
  ExecuteTypeArgs,
  FeeEstimateResult,
  TransactionResult,
  UseFeeEstimateResult,
  UseTransactionOptions,
  UseTransactionOptionsWithoutType,
  UseTransactionOptionsWithType,
  UseTransactionResult,
  UseTransactionWithoutType,
  UseTransactionWithType
};

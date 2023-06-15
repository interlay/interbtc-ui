import { CurrencyExt, LiquidityPool } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { ExtrinsicStatus } from '@polkadot/types/interfaces';
import { ISubmittableResult } from '@polkadot/types/types';
import { mergeProps } from '@react-aria/utils';
import { Key, useCallback, useState } from 'react';
import { MutationFunction, useMutation, UseMutationOptions, UseMutationResult } from 'react-query';

import { TransactionFeeDetailsProps } from '@/components';
import { GOVERNANCE_TOKEN } from '@/config/relay-chains';
import { useSubstrate } from '@/lib/substrate';

import { useGetLiquidityPools } from '../api/amm/use-get-liquidity-pools';
import { useGetCurrencies } from '../api/use-get-currencies';
import { useSelectCurrency } from '../use-select-currency';
import { getExtrinsic, getStatus } from './extrinsics';
import { Transaction, TransactionActions, TransactionArgs } from './types';
import { useTransactionNotifications } from './use-transaction-notifications';
import { estimateTransactionFee, wrapWithTxFeeSwap } from './utils/fee';
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
  estimateFee<D extends Transaction = T>(type: D, ...args: TransactionArgs<D>): Promise<MonetaryAmount<CurrencyExt>>;
};

type ExecuteFunctions<T extends Transaction> = ExecuteArgs<T> | ExecuteTypeArgs<T>;

type ReactQueryUseMutationResult = Omit<
  UseMutationResult<TransactionResult, Error, TransactionActions, unknown>,
  'mutate' | 'mutateAsync'
>;

type FeeResultType<T extends Transaction> = {
  currency: CurrencyExt;
  value: MonetaryAmount<CurrencyExt> | undefined;
  onChangeFeeCurrency: (currency: CurrencyExt) => void;
  estimateFee<D extends Transaction = T>(...args: TransactionArgs<D>): Promise<void>;
};

type UseTransactionResult<T extends Transaction> = {
  reject: (error?: Error) => void;
  isSigned: boolean;
  fee: FeeResultType<T>;
  feeDetailsProps: Pick<TransactionFeeDetailsProps, 'amount' | 'selectProps'>;
} & ReactQueryUseMutationResult &
  ExecuteFunctions<T>;

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

  const { getCurrencyFromTicker } = useGetCurrencies(true);

  const [isSigned, setSigned] = useState(false);
  const [feeCurrency, setFeeCurrency] = useState(GOVERNANCE_TOKEN);
  const [feeEstimate, setFeeEstimate] = useState<MonetaryAmount<CurrencyExt>>();

  // TEMP
  const selectCurrency = useSelectCurrency();

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
    mutateTransaction(feeCurrency, pools || []),
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
    async (...args: Parameters<FeeResultType<T>['estimateFee']>) => {
      const params = getParams(args);

      const fee = await estimateTransactionFee(feeCurrency, pools || [])(params);
      setFeeEstimate(fee);
    },
    [feeCurrency, pools, getParams]
  );

  const handleFeeCurrencyChange = useCallback((currency: CurrencyExt) => {
    setFeeCurrency(currency);
  }, []);

  const handleFeeTokenSelection = (key: Key) => {
    const currency = getCurrencyFromTicker(key as string);

    if (!currency) return;

    setFeeCurrency(currency);
  };

  return {
    ...transactionMutation,
    isSigned,
    reject: handleReject,
    execute: handleExecute,
    executeAsync: handleExecuteAsync,
    feeDetailsProps: {
      amount: feeEstimate,
      selectProps: {
        value: feeCurrency.ticker,
        items: selectCurrency.items,
        onSelectionChange: handleFeeTokenSelection
      }
    },
    fee: {
      currency: feeCurrency,
      value: feeEstimate,
      onChangeFeeCurrency: handleFeeCurrencyChange,
      estimateFee: handleEstimateFee
    }
  };
}

export { useTransaction };
export type { TransactionResult, UseTransactionResult };

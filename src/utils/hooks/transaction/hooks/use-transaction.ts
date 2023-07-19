import { CurrencyExt } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { mergeProps } from '@react-aria/utils';
import { useCallback } from 'react';
import { MutationFunction, useMutation } from 'react-query';

import { useSubstrate } from '@/lib/substrate';

import { useGetLiquidityPools } from '../../api/amm/use-get-liquidity-pools';
import { useGetBalances } from '../../api/tokens/use-get-balances';
import { getExtrinsic, getStatus } from '../extrinsics';
import { Transaction, TransactionActions } from '../types';
import {
  TransactionResult,
  UseTransactionOptions,
  UseTransactionOptionsWithoutType,
  UseTransactionOptionsWithType,
  UseTransactionResult,
  UseTransactionWithoutType,
  UseTransactionWithType
} from '../types/hook';
import { wrapWithTxFeeSwap } from '../utils/fee';
import { getActionData, getAmountWithFeeDeducted } from '../utils/params';
import { submitTransaction } from '../utils/submit';
import { FeeEstimateResult, useFeeEstimate } from './use-fee-estimate';
import { useTransactionNotifications } from './use-transaction-notifications';

// The three declared functions are use to infer types on diferent implementations
function useTransaction<T extends Transaction>(
  type: T,
  options?: UseTransactionOptionsWithType
): UseTransactionWithType<T>;
function useTransaction<T extends Transaction>(
  options?: UseTransactionOptionsWithoutType
): UseTransactionWithoutType<T>;
function useTransaction<T extends Transaction>(
  typeOrOptions?: T | UseTransactionOptions,
  options?: UseTransactionOptions
): UseTransactionResult<T> {
  const { state } = useSubstrate();
  const { data: pools } = useGetLiquidityPools();
  const { getAvailableBalance } = useGetBalances();

  const { showSuccessModal, customStatus, onFeeChange, ...mutateOptions } =
    (typeof typeOrOptions === 'string' ? options : typeOrOptions) || {};

  const { data: feeData, ...feeEstimate } = useFeeEstimate<T>(
    typeof typeOrOptions === 'string' ? typeOrOptions : undefined,
    { onSuccess: onFeeChange }
  );

  const notifications = useTransactionNotifications({ showSuccessModal });

  const { onSigning, ...optionsProp } = mergeProps(
    mutateOptions,
    {
      onError: (error: Error) => console.error(error.message),
      onSuccess: () => feeEstimate.reset()
    },
    notifications.mutationProps
  );

  const mutateTransaction: MutationFunction<TransactionResult, TransactionActions> = useCallback(
    async (params) => {
      const expectedStatus = params.customStatus || getStatus(params.type);
      const baseExtrinsic = await getExtrinsic(params);
      const feeWrappedExtrinsic = wrapWithTxFeeSwap(feeData?.amount, baseExtrinsic, pools);

      const events = {
        onReady: () => onSigning(params)
      };

      return submitTransaction(window.bridge.api, params.accountAddress, feeWrappedExtrinsic, expectedStatus, events);
    },
    [feeData?.amount, onSigning, pools]
  );

  const { mutate, mutateAsync, ...transactionMutation } = useMutation(mutateTransaction, optionsProp);

  const getBaseParams = useCallback(
    async (...args: Parameters<UseTransactionResult<T>['execute']>): Promise<TransactionActions> => {
      const params = getActionData(args, typeOrOptions);

      return {
        ...params,
        customStatus,
        timestamp: new Date().getTime(),
        // Execution should only ran when authenticated
        accountAddress: state.selectedAccount?.address as string
      };
    },
    [typeOrOptions, customStatus, state.selectedAccount?.address]
  );

  const handleExecute = useCallback(
    async (...args: Parameters<UseTransactionResult<T>['execute']>) => {
      const params = await getBaseParams(...args);

      return mutate(params);
    },
    [getBaseParams, mutate]
  );

  const handleExecuteAsync = useCallback(
    async (...args: Parameters<UseTransactionResult<T>['executeAsync']>) => {
      const params = await getBaseParams(...args);

      return mutateAsync(params);
    },
    [getBaseParams, mutateAsync]
  );

  const handleReject = (error?: Error) => {
    notifications.onReject(error);

    if (error) {
      console.error(error.message);
    }
  };

  const calculateAmountWithFeeDeducted = useCallback(
    (amount: MonetaryAmount<CurrencyExt>, fee?: FeeEstimateResult) => {
      const feeResult = fee || feeData;

      const balance = feeResult && getAvailableBalance(feeResult.amount.currency.ticker);

      if (!feeResult || !balance) {
        return amount;
      }

      return getAmountWithFeeDeducted(amount, feeResult.amount, balance);
    },
    [feeData, getAvailableBalance]
  );

  return {
    ...transactionMutation,
    reject: handleReject,
    execute: handleExecute,
    executeAsync: handleExecuteAsync,
    calculateAmountWithFeeDeducted,
    fee: {
      ...feeEstimate,
      data: feeData
    }
  };
}

export { useTransaction };
export type { TransactionResult, UseTransactionOptions, UseTransactionResult };

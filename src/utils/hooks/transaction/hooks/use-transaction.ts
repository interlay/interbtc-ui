import { mergeProps } from '@react-aria/utils';
import { useCallback } from 'react';
import { MutationFunction, useMutation } from 'react-query';

import { useSubstrate } from '@/lib/substrate';

import { useGetLiquidityPools } from '../../api/amm/use-get-liquidity-pools';
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
import { subtractFee, wrapWithTxFeeSwap } from '../utils/fee';
import { getActionData } from '../utils/params';
import { submitTransaction } from '../utils/submit';
import { useFeeEstimate } from './use-fee-estimate';
import { useTransactionNotifications } from './use-transaction-notifications';

// The three declared functions are use to infer types on diferent implementations
function useTransaction<T extends Transaction>(
  type: T,
  options?: UseTransactionOptionsWithType<T>
): UseTransactionWithType<T>;
function useTransaction<T extends Transaction>(
  options?: UseTransactionOptionsWithoutType<T>
): UseTransactionWithoutType<T>;
function useTransaction<T extends Transaction>(
  typeOrOptions?: T | UseTransactionOptions<T>,
  options?: UseTransactionOptions<T>
): UseTransactionResult<T> {
  const { state } = useSubstrate();
  const { data: pools } = useGetLiquidityPools();

  const { showSuccessModal, customStatus, preEstimate, enablePreEstimate, ...mutateOptions } =
    (typeof typeOrOptions === 'string' ? options : typeOrOptions) || {};

  const { data: feeData, ...feeEstimate } = useFeeEstimate<T>({
    enablePreEstimate,
    preEstimate,
    typeOrOptions
  });

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

  // Handles params for both type of implementations
  const getBaseParams = useCallback(
    async (...args: Parameters<UseTransactionResult<T>['execute']>): Promise<TransactionActions> => {
      const params = getActionData(args, typeOrOptions);

      const feeData = await feeEstimate.estimateAsync<T>(...(args as [any]));

      const finalParams = feeData?.isSameAsActionCurrency ? subtractFee(params, feeData) : params;

      return {
        ...finalParams,
        customStatus,
        timestamp: new Date().getTime(),
        // Execution should only ran when authenticated
        accountAddress: state.selectedAccount?.address as string
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  return {
    ...transactionMutation,
    reject: handleReject,
    execute: handleExecute,
    executeAsync: handleExecuteAsync,
    fee: {
      ...feeEstimate,
      data: feeData
    }
  };
}

export { useTransaction };
export type { TransactionResult, UseTransactionOptions, UseTransactionResult };

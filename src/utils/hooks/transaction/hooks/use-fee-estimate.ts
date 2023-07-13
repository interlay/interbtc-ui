import { CurrencyExt, isCurrencyEqual } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { Key, useCallback, useRef, useState } from 'react';
import { useErrorHandler } from 'react-error-boundary';
import { MutationFunction, useMutation, UseMutationResult } from 'react-query';
import { useSelector } from 'react-redux';
import { useInterval } from 'react-use';

import { StoreType } from '@/common/types/util.types';
import { SelectProps } from '@/component-library';
import { GOVERNANCE_TOKEN } from '@/config/relay-chains';
import { REFETCH_INTERVAL } from '@/utils/constants/api';

import { useGetLiquidityPools } from '../../api/amm/use-get-liquidity-pools';
import { useGetBalances } from '../../api/tokens/use-get-balances';
import { useGetCurrencies } from '../../api/use-get-currencies';
import { Actions, Transaction, TransactionArgs } from '../types';
import { UseTransactionOptions } from '../types/hook';
import { estimateTransactionFee, getActionAmount } from '../utils/fee';
import { getActionData } from '../utils/params';

const isFeeValid = (
  amount: MonetaryAmount<CurrencyExt>,
  balance?: MonetaryAmount<CurrencyExt>,
  actionAmount?: MonetaryAmount<CurrencyExt>
): boolean => {
  if (!balance) {
    return true;
  }

  // if the currency being trasfered is not the same as the one used for fees
  // check if the
  if (!actionAmount) {
    return balance.gte(amount);
  }

  const isActionAmountValid = actionAmount.gt(balance);

  if (!isActionAmountValid) {
    return true;
  }

  // TODO: should it be greater or equal?
  return balance.gte(amount);
};

type EstimateFeeVariables = { params: Actions; currency: CurrencyExt };

type FeeEstimateResult = {
  amount: MonetaryAmount<CurrencyExt>;
  isEqualToActionCurrency: boolean;
  isValid: boolean;
};

type EstimateArgs<T extends Transaction> = {
  estimate<D extends Transaction = T>(...args: TransactionArgs<D>): void;
  estimateAsync<D extends Transaction = T>(...args: TransactionArgs<D>): Promise<FeeEstimateResult>;
};

type EstimateTypeArgs<T extends Transaction> = {
  estimate<D extends Transaction = T>(type: D, ...args: TransactionArgs<D>): void;
  estimateAsync<D extends Transaction = T>(type: D, ...args: TransactionArgs<D>): Promise<FeeEstimateResult>;
};

type EstimateFunctions<T extends Transaction> = EstimateArgs<T> | EstimateTypeArgs<T>;

type ReactQueryUseFeeEstimateResult = Omit<
  UseMutationResult<FeeEstimateResult, Error, EstimateFeeVariables, unknown>,
  'mutate' | 'mutateAsync'
>;

type UseFeeEstimateResult<T extends Transaction> = {
  defaultCurrency: CurrencyExt;
  currency: CurrencyExt;
  selectProps: Pick<SelectProps, 'value' | 'onSelectionChange'>;
  isEqualFeeCurrency: (currency: CurrencyExt) => boolean;
} & ReactQueryUseFeeEstimateResult &
  EstimateFunctions<T>;

const defaultFeeCurrency = GOVERNANCE_TOKEN;

function useFeeEstimate<T extends Transaction>({
  typeOrOptions
}: {
  typeOrOptions?: T | UseTransactionOptions;
}): UseFeeEstimateResult<T> {
  const { bridgeLoaded } = useSelector((state: StoreType) => state.general);
  const { data: pools } = useGetLiquidityPools();
  const { getCurrencyFromTicker } = useGetCurrencies(bridgeLoaded);
  const { getBalance } = useGetBalances();

  const [feeCurrency, setFeeCurrency] = useState(defaultFeeCurrency);

  const feeResultRef = useRef<FeeEstimateResult>();
  const estimateFeeVariablesRef = useRef<EstimateFeeVariables>();

  const mutateFee: MutationFunction<FeeEstimateResult, EstimateFeeVariables> = useCallback(
    async ({ params, currency }) => {
      const amount = await estimateTransactionFee(currency, pools || [], params);

      const feeBalance = getBalance(currency.ticker)?.transferable;

      const actionAmount = getActionAmount(params, amount.currency);

      const isValid = isFeeValid(amount, feeBalance, actionAmount);

      return {
        amount,
        isEqualToActionCurrency: !!actionAmount,
        isValid
      };

      // returning undefined means that action amount is not based on fee currency (i.e. amount being transfered)
    },
    [getBalance, pools]
  );

  const { data, mutate, mutateAsync, ...feeMutation } = useMutation<
    FeeEstimateResult,
    Error,
    EstimateFeeVariables,
    unknown
  >(mutateFee, {
    onSuccess: (data) => {
      feeResultRef.current = data;
    }
  });

  useErrorHandler(feeMutation.error);

  const handleEstimateFee = useCallback(
    (...args: Parameters<EstimateArgs<T>['estimate']>) => {
      const params = getActionData(args, typeOrOptions);

      const variables = { params, currency: feeCurrency };

      estimateFeeVariablesRef.current = variables;

      mutate(variables);
    },
    [typeOrOptions, feeCurrency, mutate]
  );

  const handleEstimateFeeAsync = useCallback(
    (...args: Parameters<EstimateArgs<T>['estimate']>) => {
      const params = getActionData(args, typeOrOptions);

      const variables = { params, currency: feeCurrency };

      estimateFeeVariablesRef.current = variables;

      return mutateAsync(variables);
    },
    [typeOrOptions, feeCurrency, mutateAsync]
  );

  // Re-estimate fee based on latest stored variables
  useInterval(() => {
    if (!estimateFeeVariablesRef.current || feeMutation.isLoading) return;
    mutate(estimateFeeVariablesRef.current);
  }, REFETCH_INTERVAL.MINUTE);

  const handleFeeSelectionChange = (ticker: Key) => {
    const currency = getCurrencyFromTicker(ticker as string);

    setFeeCurrency(currency);

    const { params } = estimateFeeVariablesRef.current || {};

    if (!params) return;

    const variables = { params, currency };

    estimateFeeVariablesRef.current = variables;

    mutate(variables);
  };

  const isEqualFeeCurrency = useCallback((currency: CurrencyExt) => isCurrencyEqual(currency, feeCurrency), [
    feeCurrency
  ]);

  const result = data || feeResultRef.current;

  return {
    ...feeMutation,
    data: result,
    defaultCurrency: defaultFeeCurrency,
    currency: feeCurrency,
    estimate: handleEstimateFee,
    estimateAsync: handleEstimateFeeAsync,
    isEqualFeeCurrency,
    selectProps: {
      value: feeCurrency.ticker,
      onSelectionChange: handleFeeSelectionChange
    }
  };
}

export { useFeeEstimate };
export type { EstimateArgs, EstimateTypeArgs, FeeEstimateResult, UseFeeEstimateResult };

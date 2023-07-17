import { CurrencyExt, isCurrencyEqual } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { mergeProps } from '@react-aria/utils';
import { Key, useCallback, useRef, useState } from 'react';
import { useErrorHandler } from 'react-error-boundary';
import { MutationFunction, useMutation, UseMutationOptions, UseMutationResult } from 'react-query';
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
import { estimateTransactionFee, getActionAmount } from '../utils/fee';
import { getActionData } from '../utils/params';

// we are deducting the fee from the action amount when the user applies max,
// so we only need to check if the balance can atleast cover for the fee amount.
const isFeeValid = (
  amount: MonetaryAmount<CurrencyExt>,
  balance?: MonetaryAmount<CurrencyExt>,
  actionAmount?: MonetaryAmount<CurrencyExt>
): boolean => {
  if (!balance) {
    return true;
  }

  // when there isn't action amount involved, we check for greater or equal
  if (!actionAmount) {
    return balance.gte(amount);
  }

  const isActionAmountValid = actionAmount.gt(balance);

  if (!isActionAmountValid) {
    return true;
  }

  // when there is action amount involved, the balance needs to be greater than
  // the fee amount, because there needs to be a minimum amount in action amount
  return balance.gt(amount);
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

type FeeEstimateOptions = Omit<
  UseMutationOptions<FeeEstimateResult, Error, EstimateFeeVariables, unknown>,
  'mutationFn'
>;

const defaultFeeCurrency = GOVERNANCE_TOKEN;

function useFeeEstimate<T extends Transaction>(type?: T, options?: FeeEstimateOptions): UseFeeEstimateResult<T> {
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
    },
    [getBalance, pools]
  );

  const { data, mutate, mutateAsync, ...feeMutation } = useMutation(
    mutateFee,
    mergeProps(options || {}, {
      onSuccess: (data: FeeEstimateResult) => {
        feeResultRef.current = data;
      }
    })
  );

  useErrorHandler(feeMutation.error);

  const handleEstimateFee = useCallback(
    (...args: Parameters<EstimateArgs<T>['estimate']>) => {
      const params = getActionData(args, type);

      const variables = { params, currency: feeCurrency };

      estimateFeeVariablesRef.current = variables;

      mutate(variables);
    },
    [type, feeCurrency, mutate]
  );

  const handleEstimateFeeAsync = useCallback(
    (...args: Parameters<EstimateArgs<T>['estimate']>) => {
      const params = getActionData(args, type);

      const variables = { params, currency: feeCurrency };

      estimateFeeVariablesRef.current = variables;

      return mutateAsync(variables);
    },
    [type, feeCurrency, mutateAsync]
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

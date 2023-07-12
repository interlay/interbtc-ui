import { CurrencyExt } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';

import { FeeEstimateResult } from '../hooks/use-fee-estimate';
import { Actions, Transaction } from '../types';
import { ExecuteFunctions } from '../types/hook';

const getActionData = <T extends Transaction>(
  args: Parameters<ExecuteFunctions<T>['execute']>,
  typeOrOptions?: T | Record<string, unknown>
): Actions => {
  let params = {};

  // Assign correct params for when transaction type is declared on hook params
  if (typeof typeOrOptions === 'string') {
    params = { type: typeOrOptions, args };
  } else {
    // Assign correct params for when transaction type is declared on execution level
    const [type, ...restArgs] = args;
    params = { type, args: restArgs };
  }

  return params as Actions;
};

const getAmount = (
  actionAmount: MonetaryAmount<CurrencyExt>,
  feeAmount: MonetaryAmount<CurrencyExt>,
  balance: MonetaryAmount<CurrencyExt>
): MonetaryAmount<CurrencyExt> => {
  const isMaxAmount = balance.eq(actionAmount);

  if (isMaxAmount) {
    return actionAmount.sub(feeAmount);
  }

  const leftoverBalance = balance.sub(actionAmount);

  if (leftoverBalance.lt(feeAmount)) {
    return actionAmount.sub(feeAmount.sub(leftoverBalance));
  }

  return actionAmount;
};

const getFeeAdaptedActionData = (
  params: Actions,
  feeData: FeeEstimateResult,
  balance: MonetaryAmount<CurrencyExt>
): Actions => {
  const { amount: feeAmount } = feeData;

  switch (params.type) {
    // /* START - AMM */
    // case Transaction.AMM_SWAP: {
    //   return window.bridge.amm.swap(...params.args);
    // }

    /* START - TOKENS */
    case Transaction.TOKENS_TRANSFER: {
      const [destination, amount] = params.args;
      params.args = [destination, getAmount(amount, feeAmount, balance)];
      /* END - TOKENS */
    }
  }

  return params;
};

export { getActionData, getFeeAdaptedActionData };

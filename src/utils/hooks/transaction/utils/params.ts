import { CurrencyExt } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';

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

const getAmountWithFeeDeducted = (
  actionAmount: MonetaryAmount<CurrencyExt>,
  feeAmount: MonetaryAmount<CurrencyExt>,
  balance: MonetaryAmount<CurrencyExt>
): MonetaryAmount<CurrencyExt> => {
  const isMaxAmount = balance.eq(actionAmount);

  // when the action amount is the max balance, the fee
  // is deducted from that action amount
  if (isMaxAmount) {
    return actionAmount.sub(feeAmount);
  }

  // is the balance left from the action amount
  const leftoverBalance = balance.sub(actionAmount);

  // if this balance is lower than the needed amount to pay
  // for fees, the rest is deducted from the action amount
  if (leftoverBalance.lt(feeAmount)) {
    return actionAmount.sub(feeAmount.sub(leftoverBalance));
  }

  return actionAmount;
};

export { getActionData, getAmountWithFeeDeducted };

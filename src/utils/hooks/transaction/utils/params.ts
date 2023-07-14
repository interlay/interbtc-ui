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

const getAmount = (
  actionAmount: MonetaryAmount<CurrencyExt>,
  feeAmount: MonetaryAmount<CurrencyExt>,
  balance: MonetaryAmount<CurrencyExt>
): MonetaryAmount<CurrencyExt> => {
  const isMaxAmount = balance.eq(actionAmount);

  console.log(actionAmount.toString(), feeAmount.toString(), balance.toString());

  if (isMaxAmount) {
    return actionAmount.sub(feeAmount);
  }

  const leftoverBalance = balance.sub(actionAmount);

  if (leftoverBalance.lt(feeAmount)) {
    return actionAmount.sub(feeAmount.sub(leftoverBalance));
  }

  return actionAmount;
};

export { getActionData, getAmount };

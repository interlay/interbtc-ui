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

export { getActionData };

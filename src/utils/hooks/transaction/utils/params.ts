import { ExtrinsicStatus } from '@polkadot/types/interfaces';

import { Transaction, TransactionActions } from '../types';
import { ExecuteFunctions } from '../use-transaction';

const getParams = <T extends Transaction>(
  args: Parameters<ExecuteFunctions<T>['execute']>,
  typeOrOptions?: T | Record<string, unknown>,
  customStatus?: ExtrinsicStatus['type']
): TransactionActions => {
  let params = {};

  // Assign correct params for when transaction type is declared on hook params
  if (typeof typeOrOptions === 'string') {
    params = { type: typeOrOptions, args };
  } else {
    // Assign correct params for when transaction type is declared on execution level
    const [type, ...restArgs] = args;
    params = { type, args: restArgs };
  }

  return {
    ...params,
    timestamp: new Date().getTime(),
    customStatus
  } as TransactionActions;
};

export { getParams };

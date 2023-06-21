import { ExtrinsicStatus } from '@polkadot/types/interfaces';

import { Transaction, TransactionActions } from '../types';
import { EstimateFunctions, ExecuteFunctions } from '../types/hook';

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

// TODO: improve because some properties should not be required here
const getFeeEstimateParams = <T extends Transaction>(
  args: Parameters<EstimateFunctions<T>['estimate']>,
  typeOrOptions?: T | Record<string, unknown>,
  customStatus?: ExtrinsicStatus['type']
): TransactionActions & { ticker: string } => {
  let argsParams = {};
  let ticker: string;

  // Assign correct params for when transaction type is declared on hook params
  if (typeof typeOrOptions === 'string') {
    argsParams = { type: typeOrOptions, args };
    ticker = args[args.length - 1];
  } else {
    // Assign correct params for when transaction type is declared on execution level
    const [type, ...restArgs] = args;
    argsParams = { type, args: restArgs };
    ticker = args[args.length - 1];
  }

  return {
    ...argsParams,
    timestamp: new Date().getTime(),
    customStatus,
    ticker
  } as TransactionActions & { ticker: string };
};

export { getFeeEstimateParams, getParams };

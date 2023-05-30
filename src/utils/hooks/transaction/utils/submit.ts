import { ExtrinsicData } from '@interlay/interbtc-api';
import { ApiPromise } from '@polkadot/api';
import { AddressOrPair, SubmittableExtrinsic } from '@polkadot/api/types';
import { DispatchError } from '@polkadot/types/interfaces';
import { ExtrinsicStatus } from '@polkadot/types/interfaces/author';
import { ISubmittableResult } from '@polkadot/types/types';

import { TransactionEvents } from '../types';
import { TransactionResult } from '../use-transaction';

type HandleTransactionResult = { result: ISubmittableResult; unsubscribe: () => void };

// When passing { nonce: -1 } to signAndSend the API will use system.accountNextIndex to determine the nonce
const transactionOptions = { nonce: -1 };

const handleTransaction = async (
  account: AddressOrPair,
  extrinsicData: ExtrinsicData,
  expectedStatus?: ExtrinsicStatus['type'],
  callbacks?: TransactionEvents
) => {
  let isComplete = false;

  // Extrinsic status
  let isReady = false;

  return new Promise<HandleTransactionResult>((resolve, reject) => {
    let unsubscribe: () => void;

    (extrinsicData.extrinsic as SubmittableExtrinsic<'promise'>)
      .signAndSend(account, transactionOptions, callback)
      .then((unsub) => (unsubscribe = unsub))
      .catch((error) => reject(error));

    function callback(result: ISubmittableResult): void {
      const { onReady } = callbacks || {};

      if (!isReady && result.status.isReady) {
        onReady?.();
        isReady = true;
      }

      if (!isComplete) {
        isComplete = expectedStatus === result.status.type;
      }

      if (isComplete) {
        resolve({ unsubscribe, result });
      }
    }
  });
};

const getErrorMessage = (api: ApiPromise, dispatchError: DispatchError) => {
  const { isModule, asModule, isBadOrigin } = dispatchError;

  // Runtime error in one of the parachain modules
  if (isModule) {
    // for module errors, we have the section indexed, lookup
    const decoded = api.registry.findMetaError(asModule);
    const { docs, name, section } = decoded;
    return `The error code is ${section}.${name}. ${docs.join(' ')}.`;
  }

  // Bad origin
  if (isBadOrigin) {
    return `The error is caused by using an incorrect account. The error code is BadOrigin ${dispatchError}.`;
  }

  return `The error is ${dispatchError}.`;
};

/**
 * Handles transaction submittion and error
 * @param {ApiPromise} api polkadot api wrapper
 * @param {AddressOrPair} account account address
 * @param {ExtrinsicData} extrinsicData transaction extrinsic data
 * @param {ExtrinsicStatus.type} expectedStatus status where the transaction is counted as fulfilled
 * @param {TransactionEvents} callbacks a set of events emitted accross the lifecycle of the transaction (i.e Bro)
 * @return {Promise<ISubmittableResult>} transaction data that also can contain meta data in case of error
 */
const submitTransaction = async (
  api: ApiPromise,
  account: AddressOrPair,
  extrinsicData: ExtrinsicData,
  expectedStatus?: ExtrinsicStatus['type'],
  callbacks?: TransactionEvents
): Promise<TransactionResult> => {
  const { result, unsubscribe } = await handleTransaction(account, extrinsicData, expectedStatus, callbacks);

  unsubscribe();

  const { dispatchError } = result;

  const error = dispatchError ? new Error(getErrorMessage(api, dispatchError)) : undefined;

  console.log(error);

  return {
    status: error ? 'error' : 'success',
    data: result,
    error
  };
};

export { submitTransaction };

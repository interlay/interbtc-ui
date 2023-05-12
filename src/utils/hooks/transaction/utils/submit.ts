import { ExtrinsicData } from '@interlay/interbtc-api';
import { ApiPromise } from '@polkadot/api';
import { AddressOrPair, SubmittableExtrinsic } from '@polkadot/api/types';
import { DispatchError } from '@polkadot/types/interfaces';
import { ExtrinsicStatus } from '@polkadot/types/interfaces/author';
import { ISubmittableResult } from '@polkadot/types/types';

import { TransactionEvents } from '../types';

type HandleTransactionResult = { result: ISubmittableResult; unsubscribe: () => void };

// When passing { nonce: -1 } to signAndSend the API will use system.accountNextIndex to determine the nonce
const options = { nonce: -1 };

const handleTransaction = async (
  account: AddressOrPair,
  extrinsicData: ExtrinsicData,
  expectedStatus?: ExtrinsicStatus['type'],
  callbacks?: TransactionEvents
) => {
  let isStatusCompleted = false;
  let isSigned = false;
  let isEventFound = false;

  return new Promise<HandleTransactionResult>((resolve, reject) => {
    let unsubscribe: () => void;

    (extrinsicData.extrinsic as SubmittableExtrinsic<'promise'>)
      .signAndSend(account, options, callback)
      .then((unsub) => (unsubscribe = unsub))
      .catch((error) => reject(error));

    function callback(result: ISubmittableResult): void {
      if (!isSigned) {
        callbacks?.onSigning?.();
        isSigned = true;
      }

      const {
        status: { type, isInBlock, isFinalized }
      } = result;

      if (!isStatusCompleted) {
        const isExpectedStatus = expectedStatus === type;
        isStatusCompleted = isExpectedStatus || isInBlock || isFinalized;
      }

      // should only search for event when it is specified and it has not been previously found
      if (extrinsicData.event !== undefined && !isEventFound) {
        for (const { event } of result.events) {
          if (extrinsicData.event.is(event)) {
            isEventFound = true;
            break;
          }
        }
      }

      const shouldResolve = isStatusCompleted && (extrinsicData.event === undefined || isEventFound);
      if (shouldResolve) {
        resolve({ unsubscribe, result });
      }
    }
  });
};

const getErrorMessage = (api: ApiPromise, dispatchError: DispatchError) => {
  const { isModule, asModule, isBadOrigin } = dispatchError;

  // Construct error message
  const message = 'The transaction failed.';

  // Runtime error in one of the parachain modules
  if (isModule) {
    // for module errors, we have the section indexed, lookup
    const decoded = api.registry.findMetaError(asModule);
    const { docs, name, section } = decoded;
    return message.concat(` The error code is ${section}.${name}. ${docs.join(' ')}`);
  }

  // Bad origin
  if (isBadOrigin) {
    return message.concat(` The error is caused by using an incorrect account.
        The error code is BadOrigin ${dispatchError}.`);
  }

  return message.concat(` The error is ${dispatchError}.`);
};

const submitTransaction = async (
  api: ApiPromise,
  account: AddressOrPair,
  extrinsicData: ExtrinsicData,
  expectedStatus?: ExtrinsicStatus['type'],
  callbacks?: TransactionEvents
): Promise<ISubmittableResult> => {
  const { result, unsubscribe } = await handleTransaction(account, extrinsicData, expectedStatus, callbacks);

  unsubscribe();

  const { dispatchError } = result;

  if (dispatchError) {
    const message = getErrorMessage(api, dispatchError);
    throw new Error(message);
  }

  return result;
};

export { submitTransaction };

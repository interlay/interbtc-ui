import { ApiPromise } from '@polkadot/api';
import { AddressOrPair, SubmittableExtrinsic } from '@polkadot/api/types';
import { DispatchError } from '@polkadot/types/interfaces';
import { ExtrinsicStatus } from '@polkadot/types/interfaces/author';
import { ISubmittableResult } from '@polkadot/types/types';

type ExtrinsicEvents = {
  onSigning?: () => void;
};

type HandleTransactionResult = { result: ISubmittableResult; unsubscribe: () => void };

// When passing { nonce: -1 } to signAndSend the API will use system.accountNextIndex to determine the nonce
const options = { nonce: -1 };

const handleTransaction = async (
  account: AddressOrPair,
  transaction: SubmittableExtrinsic<'promise'>,
  events?: ExtrinsicEvents,
  expectedStatus?: ExtrinsicStatus['type']
) => {
  let isCompleted = false;
  let isSigned = false;

  return new Promise<HandleTransactionResult>((resolve, reject) => {
    let unsubscribe: () => void;

    transaction
      .signAndSend(account, options, callback)
      .then((unsub) => (unsubscribe = unsub))
      .catch((error) => reject(error));

    function callback(result: ISubmittableResult): void {
      if (!isSigned) {
        events?.onSigning?.();
        isSigned = true;
      }

      const {
        status: { type, isInBlock, isFinalized }
      } = result;

      if (!isCompleted) {
        const isExpectedStatus = expectedStatus && expectedStatus === type;
        isCompleted = isExpectedStatus || isInBlock || isFinalized;
      }

      if (isCompleted) {
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
    // Bad origin
  }

  if (isBadOrigin) {
    return message.concat(` The error is caused by using an incorrect account.
        The error code is BadOrigin ${dispatchError}.`);
  }

  return message.concat(` The error is ${dispatchError}.`);
};

const submitTransaction = async (
  api: ApiPromise,
  account: AddressOrPair,
  transaction: SubmittableExtrinsic<'promise'>,
  events?: ExtrinsicEvents,
  expectedStatus?: ExtrinsicStatus['type']
): Promise<ISubmittableResult> => {
  const { result, unsubscribe } = await handleTransaction(account, transaction, events, expectedStatus);

  unsubscribe();

  const { dispatchError } = result;

  if (dispatchError) {
    const message = getErrorMessage(api, dispatchError);
    throw new Error(message);
  }

  return result;
};

export { submitTransaction };

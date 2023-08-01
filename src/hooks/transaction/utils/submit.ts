import { ExtrinsicData } from '@interlay/interbtc-api';
import { ApiPromise } from '@polkadot/api';
import { AddressOrPair, SubmittableExtrinsic } from '@polkadot/api/types';
import { ExtrinsicStatus } from '@polkadot/types/interfaces/author';
import { ISubmittableResult } from '@polkadot/types/types';

import { TransactionResult } from '../hooks/use-transaction';
import { TransactionEvents } from '../types';
import { dryRunAndPossiblyThrow } from './dry-run';
import { getErrorMessage } from './error';

type HandleTransactionResult = { result: ISubmittableResult; unsubscribe: () => void };

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
      // Extrinsic is signed at first and then we use the same signed extrinsic
      // for dry-running and submission.
      .signAsync(account, { nonce: -1 })
      .then(dryRunAndPossiblyThrow)
      .then((signedExtrinsic) => signedExtrinsic.send(callback))
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

      if (isComplete || result.status.isUsurped) {
        resolve({ unsubscribe, result });
      }
    }
  });
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

  let error: Error | undefined;

  const { dispatchError } = result;

  if (dispatchError) {
    error = new Error(getErrorMessage(api, dispatchError));
  }

  // TODO: determine a description to when transaction ends up usurped
  if (result.status.isUsurped) {
    error = new Error();
  }

  return {
    status: error ? 'error' : 'success',
    data: result,
    error
  };
};

export { submitTransaction };

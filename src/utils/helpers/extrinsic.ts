import { ExtrinsicData, newExtrinsicStatus } from '@interlay/interbtc-api';
import { ExtrinsicStatus } from '@polkadot/types/interfaces/author';
import { ISubmittableResult } from '@polkadot/types/types';

const getExtrinsicStatus = (type: 'InBlock' | 'Finalized'): ExtrinsicStatus => {
  if (window.bridge === undefined) {
    throw new Error('InterBTCApi is not initialized.');
  }
  return newExtrinsicStatus(window.bridge.api, type);
};

/**
 * Helper to simple extrinsic submission. Waits for inBlock inclusion only by default.
 *
 * @param {ExtrinsicData} extrinsicData Extrinsic to submit and event to wait for.
 * @param {ExtrinsicStatus} extrinsicStatus Optional parameter to specify extrinsic status to wait for. Defaults to inBlock.
 */
const submitExtrinsic = async (
  extrinsicData: ExtrinsicData,
  extrinsicStatus?: ExtrinsicStatus
): Promise<ISubmittableResult> => {
  // Use InBlock if status is not specified.
  const status = extrinsicStatus ? extrinsicStatus : getExtrinsicStatus('InBlock');
  const { extrinsic, event } = extrinsicData;
  return await window.bridge.transaction.sendLogged(extrinsic, event, status);
};

const submitExtrinsicPromise = async (
  extrinsicDataPromise: Promise<ExtrinsicData>,
  extrinsicStatus?: ExtrinsicStatus
): Promise<ISubmittableResult> => {
  const extrinsicData = await extrinsicDataPromise;
  return submitExtrinsic(extrinsicData, extrinsicStatus);
};

export { getExtrinsicStatus, submitExtrinsic, submitExtrinsicPromise };

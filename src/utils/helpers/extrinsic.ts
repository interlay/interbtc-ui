import { ExtrinsicData, newExtrinsicStatus } from '@interlay/interbtc-api';
import { ExtrinsicStatus } from '@polkadot/types/interfaces/author';
import { ISubmittableResult } from '@polkadot/types/types';

const InBlockExtrinsicStatus = newExtrinsicStatus(window.bridge.api, 'InBlock');
const FinalizedExtrinsicStatus = newExtrinsicStatus(window.bridge.api, 'Finalized');

/**
 * Helper to simple extrinsic submission. Waits for inBlock inclusion only by default.
 *
 * @param {ExtrinsicData} extrinsicData Extrinsic to submit and event to wait for.
 * @param {ExtrinsicStatus} extrinsicStatus Optional parameter to specify extrinsic status to wait for. Defaults to inBlock.
 */
const submitExtrinsic = async (
  extrinsicData: ExtrinsicData,
  extrinsicStatus: ExtrinsicStatus = InBlockExtrinsicStatus
): Promise<ISubmittableResult> => {
  const { extrinsic, event } = extrinsicData;
  return await window.bridge.transaction.sendLogged(extrinsic, event, extrinsicStatus);
};

const submitExtrinsicPromise = async (
  extrinsicDataPromise: Promise<ExtrinsicData>,
  extrinsicStatus: ExtrinsicStatus = InBlockExtrinsicStatus
): Promise<ISubmittableResult> => {
  const extrinsicData = await extrinsicDataPromise;
  return submitExtrinsic(extrinsicData, extrinsicStatus);
};

export { FinalizedExtrinsicStatus, InBlockExtrinsicStatus, submitExtrinsic, submitExtrinsicPromise };

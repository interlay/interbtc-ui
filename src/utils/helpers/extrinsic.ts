import { ExtrinsicData } from '@interlay/interbtc-api';
import { ExtrinsicStatus } from '@polkadot/types/interfaces/author';
import { ISubmittableResult } from '@polkadot/types/types';

const inBlockStatus = window.bridge.api.createType('ExtrinsicStatus', 'InBlock');

/**
 * Helper to simple extrinsic submission. Waits for inBlock inclusion only by default.
 *
 * @param {ExtrinsicData} extrinsicData Extrinsic to submit and event to wait for.
 * @param {ExtrinsicStatus} extrinsicStatus Optional parameter to specify extrinsic status to wait for. Defaults to inBlock.
 */
const submitExtrinsic = async (
  extrinsicData: ExtrinsicData,
  extrinsicStatus: ExtrinsicStatus = inBlockStatus
): Promise<ISubmittableResult> => {
  const { extrinsic, event } = extrinsicData;
  await window.bridge.transaction.sendLogged(extrinsic, event, extrinsicStatus);
};

export { submitExtrinsic };

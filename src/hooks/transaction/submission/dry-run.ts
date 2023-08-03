import { SubmittableExtrinsic } from '@polkadot/api/types';

import { getErrorMessage } from './error';

/**
 * Dry-run signed submittable extrinsic if dry-running is enabled on RPC node.
 *
 * @throws If extrinsic execution failed during dry running.
 * @param signedExtrinsic Extrinsic to be dry run.
 * @returns {SubmittableExtrinsic} Dry-ran extrinsic.
 */

const dryRun = async (signedExtrinsic: SubmittableExtrinsic<'promise'>): Promise<SubmittableExtrinsic<'promise'>> => {
  // Dry-run if enabled on RPC node.
  // Source: Polkadot.js, https://github.com/polkadot-js/api/blob/319535a1e938e89522ff18ef2d1cef66a5af597c/packages/api/src/submittable/createClass.ts#L110
  if (signedExtrinsic.hasDryRun) {
    const dryRunResult = await window.bridge.api.rpc.system.dryRun(signedExtrinsic.toHex());

    // If dry-running fails, code execution throws and extrinsic is not submitted.
    if (dryRunResult.isErr) {
      const error = dryRunResult.asErr;
      const errMessage = error.toString();
      throw new Error(errMessage);
    }

    // Handle dry-run result nested error.
    if (dryRunResult.isOk && dryRunResult.asOk.isErr) {
      const error = dryRunResult.asOk.asErr;
      const errMessage = getErrorMessage(window.bridge.api, error);
      throw new Error(errMessage);
    }
  }
  return signedExtrinsic;
};

export { dryRun };

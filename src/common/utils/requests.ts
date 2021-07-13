import { Collateral, Wrapped, ReplaceRequestStatus } from '@interlay/interbtc/build/interfaces/default';
import { VaultReplaceRequest } from '../types/vault.types';
import { H256 } from '@polkadot/types/interfaces';
import {
  satToBTC,
  planckToDOT,
  stripHexPrefix,
  ReplaceRequestExt as ParachainReplaceRequest
} from '@interlay/interbtc';
import Big from 'big.js';

// TODO: move functions to lib

const parachainToUIReplaceRequests = (requests: Map<H256, ParachainReplaceRequest>): VaultReplaceRequest[] => {
  const replaceRequests: VaultReplaceRequest[] = [];
  requests.forEach((request, requestId) => {
    const [btcAddress, polkaBTC, lockedDOT] = convertParachainTypes(request);
    replaceRequests.push({
      id: stripHexPrefix(requestId.toString()),
      timestamp: request.btc_height.toString(),
      newVault: request.new_vault.toString(),
      oldVault: request.old_vault.toString(),
      btcAddress: btcAddress,
      polkaBTC: polkaBTC,
      lockedDOT: lockedDOT,
      status: parseReplaceRequestStatus(request.status)
    });
  });
  return replaceRequests;
};

const parseReplaceRequestStatus = (status: ReplaceRequestStatus): string => {
  if (status.isPending) {
    return 'Pending';
  } else if (status.isCompleted) {
    return 'Completed';
  } else if (status.isCancelled) {
    return 'Cancelled';
  }
  return '';
};

interface ParsableParachainTypes {
  // eslint-disable-next-line camelcase
  btc_address: string;
  // eslint-disable-next-line camelcase
  amount_polka_btc?: Wrapped;
  amount?: Wrapped;
  // eslint-disable-next-line camelcase
  amount_dot?: Collateral;
  // eslint-disable-next-line camelcase
  griefing_collateral?: Collateral;
  // eslint-disable-next-line camelcase
  premium_dot?: Collateral;
}

/**
 * Parses types which belong to request objects and need parsing/conversion to be displayed in the UI.
 *
 * @param parachainObject A request object, which must have a BTC address, a InterBTC amount and a Collateral amount.
 * @return A tuple with the parsed properties
 */

function convertParachainTypes(parachainObject: ParsableParachainTypes): [string, string, string] {
  let parsedPolkaBTC = new Big(0);
  let parsedDOT = new Big(0);

  if (parachainObject.amount_polka_btc) {
    parsedPolkaBTC = satToBTC(parachainObject.amount_polka_btc);
  } else if (parachainObject.amount) {
    parsedPolkaBTC = satToBTC(parachainObject.amount);
  } else {
    throw new Error('No property found for InterBTC amount');
  }

  if (parachainObject.premium_dot && parachainObject.premium_dot.toString() !== '0') {
    parsedDOT = planckToDOT(parachainObject.premium_dot);
  } else if (parachainObject.amount_dot) {
    parsedDOT = planckToDOT(parachainObject.amount_dot);
  } else if (parachainObject.griefing_collateral) {
    parsedDOT = planckToDOT(parachainObject.griefing_collateral);
  } else {
    throw new Error('No property found for Collateral amount');
  }

  return [parachainObject.btc_address, parsedPolkaBTC.toString(), parsedDOT.toString()];
}

export { parachainToUIReplaceRequests };

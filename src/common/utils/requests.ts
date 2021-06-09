import { DOT, PolkaBTC, ReplaceRequestStatus } from '@interlay/polkabtc/build/interfaces/default';
import { VaultReplaceRequest } from '../types/vault.types';
import { H256 } from '@polkadot/types/interfaces';
import {
  satToBTC,
  planckToDOT,
  stripHexPrefix,
  ReplaceRequestExt as ParachainReplaceRequest,
  Issue,
  Redeem
} from '@interlay/polkabtc';

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

interface DynamicObject {
  [key: string]: Issue[] | Redeem[];
}

const mapToArray = (map: Map<string, Issue[] | Redeem[]>): DynamicObject => {
  const result: DynamicObject = {};
  map.forEach((value, key) => {
    result[key] = value;
  });
  return result;
};

const arrayToMap = (arr: Issue[][] | Redeem[][]): Map<string, Issue[] | Redeem[]> => {
  const map = new Map();
  // eslint-disable-next-line guard-for-in
  for (const key in arr) {
    map.set(key, arr[key]);
  }
  return map;
};

interface ParsableParachainTypes {
  // eslint-disable-next-line camelcase
  btc_address: string;
  // eslint-disable-next-line camelcase
  amount_polka_btc?: PolkaBTC;
  amount?: PolkaBTC;
  // eslint-disable-next-line camelcase
  amount_dot?: DOT;
  // eslint-disable-next-line camelcase
  griefing_collateral?: DOT;
  // eslint-disable-next-line camelcase
  premium_dot?: DOT;
}

/**
 * Parses types which belong to request objects and need parsing/conversion to be displayed in the UI.
 *
 * @param parachainObject A request object, which must have a BTC address, a PolkaBTC amount and a DOT amount.
 * @return A tuple with the parsed properties
 */

function convertParachainTypes(parachainObject: ParsableParachainTypes): [string, string, string] {
  let parsedPolkaBTC = '';
  let parsedDOT = '';

  if (parachainObject.amount_polka_btc) {
    parsedPolkaBTC = satToBTC(parachainObject.amount_polka_btc.toString());
  } else if (parachainObject.amount) {
    parsedPolkaBTC = satToBTC(parachainObject.amount.toString());
  } else {
    throw new Error('No property found for PolkaBTC amount');
  }

  if (parachainObject.premium_dot && parachainObject.premium_dot.toString() !== '0') {
    parsedDOT = planckToDOT(parachainObject.premium_dot.toString());
  } else if (parachainObject.amount_dot) {
    parsedDOT = planckToDOT(parachainObject.amount_dot.toString());
  } else if (parachainObject.griefing_collateral) {
    parsedDOT = planckToDOT(parachainObject.griefing_collateral.toString());
  } else {
    throw new Error('No property found for DOT amount');
  }

  return [parachainObject.btc_address, parsedPolkaBTC, parsedDOT];
}

export { parachainToUIReplaceRequests, arrayToMap, mapToArray };

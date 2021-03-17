import { RedeemRequest, RedeemRequestStatus, VaultRedeem } from '../types/redeem.types';
import { IssueRequest, IssueRequestStatus, VaultIssue } from '../types/issue.types';
import { DOT, PolkaBTC } from '@interlay/polkabtc/build/interfaces/default';
import { VaultReplaceRequest } from '../types/vault.types';
import { H256, BlockNumber } from '@polkadot/types/interfaces';
import {
  satToBTC,
  planckToDOT,
  uint8ArrayToString,
  bitcoin,
  stripHexPrefix,
  reverseEndianness,
  IssueRequestExt as ParachainIssueRequest,
  RedeemRequestExt as ParachainRedeemRequest,
  ReplaceRequestExt as ParachainReplaceRequest,
  roundTwoDecimals
} from '@interlay/polkabtc';
import { NUMERIC_STRING_REGEX, BITCOIN_NETWORK, ACCOUNT_ID_TYPE_NAME } from '../../constants';
import { Dispatch } from 'redux';
import { updateBalanceDOTAction, updateBalancePolkaBTCAction } from '../actions/general.actions';
import Big from 'big.js';
import { TableDisplayParams, RelayedBlock } from '../types/util.types';
import { Issue, Redeem } from '@interlay/polkabtc-stats';
import { AccountId, Balance } from '@polkadot/types/interfaces/runtime';
import BN from 'bn.js';

// TODO: should be one module
function safeRoundTwoDecimals(input: string | number | undefined, defaultValue = '0'): string {
  if (input === undefined) return defaultValue;
  else return roundTwoDecimals(input.toString());
}
function safeRoundEightDecimals(input: string | number | undefined, defaultValue = '0'): string {
  if (input === undefined) return defaultValue;
  const number = new Big(input);
  return number.round(8).toString();
}
function safeRoundFiveDecimals(
  input: string | number | undefined,
  defaultValue = '0'
): string {
  if (input === undefined) return defaultValue;
  const number = new Big(input);
  return number.round(5).toString();
}

function shortAddress(address: string): string {
  if (address.length < 12) return address;
  return address.substr(0, 6) + '...' + address.substr(address.length - 7, address.length - 1);
}

function shortTxId(txid: string): string {
  if (txid.length < 20) return txid;
  return txid.substr(0, 10) + '...' + txid.substr(txid.length - 11, txid.length - 1);
}

function formatDateTime(date: Date): string {
  return date.toDateString().substring(4) + ' ' + date.toTimeString().substring(0, 5);
}

function formatDateTimePrecise(date: Date): string {
  return date.toDateString().substring(4) + ' ' + date.toTimeString().substring(0, 8);
}

// always round USD amounts to two decimals
function getUsdAmount(amount: string, rate: number): string {
  return new Big(amount).mul(new Big(rate)).toFixed(2).toString();
}

function displayBtcAmount(amount: string | number): string {
  return new Big(amount).round(8).toString();
}

/**
 * Converts an IssueRequest object retrieved from the parachain
 * to a UI IssueRequest object
 *
 * @param id H256, the key of the IssueRequest object in the parachain map storage object
 * @param parachainIssueRequest ParachainIssueRequest
 * @param parachainHeight parachainHeight data (queried from the parachain)
 * @param issuePeriod issuePeriod data (queried from the parachain)
 * @param requiredBtcConfirmations requiredBtcConfirmations data (queried from the parachain)
 */

async function parachainToUIIssueRequest(
  id: H256,
  parachainIssueRequest: ParachainIssueRequest
): Promise<IssueRequest> {
  const [parachainHeight, issuePeriod, requiredBtcConfirmations] = await Promise.all([
    window.polkaBTC.system.getCurrentBlockNumber(),
    window.polkaBTC.issue.getIssuePeriod(),
    window.polkaBTC.btcRelay.getStableBitcoinConfirmations()
  ]);
  const amountBTC = satToBTC(parachainIssueRequest.amount.toString());
  const fee = satToBTC(parachainIssueRequest.fee.toString());
  const status = computeIssueRequestStatus(
    parachainIssueRequest.completed.isTrue,
    parachainIssueRequest.cancelled.isTrue,
    parachainIssueRequest.opentime,
    parachainHeight,
    issuePeriod,
    requiredBtcConfirmations
  );
  return {
    id: stripHexPrefix(id.toString()),
    requestedAmountPolkaBTC: amountBTC,
    timestamp: formatDateTimePrecise(new Date(Date.now())),
    creation: parachainIssueRequest.opentime.toString(),
    vaultBTCAddress: parachainIssueRequest.btc_address,
    vaultDOTAddress: parachainIssueRequest.vault.toString(),
    btcTxId: '',
    fee,
    totalAmount: new Big(amountBTC).add(fee).toString(),
    griefingCollateral: parachainIssueRequest.griefing_collateral.toString(),
    confirmations: 0,
    status,
    refundBtcAddress: '',
    refundAmountBtc: '',
    issuedAmountBtc: '',
    btcAmountSubmittedByUser: ''
  };
}

const statsToUIIssueRequest = async (
  statsIssue: Issue,
  currentBTCHeight: number,
  parachainHeight: BlockNumber,
  issuePeriod: BlockNumber,
  requiredBtcConfirmations: number
): Promise<IssueRequest> => ({
  id: statsIssue.id,
  requestedAmountPolkaBTC: new Big(statsIssue.amountBTC).sub(new Big(statsIssue.feePolkabtc)).toString(),
  timestamp: statsIssue.timestamp,
  totalAmount: statsIssue.amountBTC,
  creation: statsIssue.creation,
  vaultBTCAddress: statsIssue.vaultBTCAddress,
  vaultDOTAddress: statsIssue.vaultDOTAddress,
  btcTxId: statsIssue.btcTxId,
  confirmations:
    // eslint-disable-next-line no-negated-condition
    statsIssue.confirmations !== undefined ?
      statsIssue.confirmations :
      statsIssue.btcBlockHeight ?
        currentBTCHeight - statsIssue.btcBlockHeight + 1 :
        0,
  transactionBlockHeight: statsIssue.btcBlockHeight,
  status: computeIssueRequestStatus(
    statsIssue.completed,
    statsIssue.cancelled,
    window.polkaBTC.api.createType('BlockNumber', statsIssue.creation),
    parachainHeight,
    issuePeriod,
    requiredBtcConfirmations,
    statsIssue.requestedRefund,
    statsIssue.btcTxId,
    statsIssue.confirmations
  ),
  fee: statsIssue.feePolkabtc,
  griefingCollateral: statsIssue.griefingCollateral,
  refundBtcAddress: statsIssue.refundBtcAddress,
  refundAmountBtc: statsIssue.refundAmountBTC,
  issuedAmountBtc: statsIssue.executedAmountBTC ?
    new Big(statsIssue.executedAmountBTC).sub(new Big(statsIssue.feePolkabtc)).toString() :
    '',
  btcAmountSubmittedByUser: satToBTC(
    (await window.polkaBTC.btcCore.getUtxoAmount(statsIssue.btcTxId, statsIssue.vaultBTCAddress)).toString()
  )
});

/**
 * Given parameters about an issue request, computes its status
 *
 * @param completed boolean
 * @param cancelled boolean
 * @param creationBlock The number of the block where this request was included
 * @param issuePeriod issuePeriod data (queried from the parachain)
 * @param requiredBtcConfirmations requiredBtcConfirmations data (queried from the parachain)
 * @param btcTxId (optional) Bitcoin transaction ID corresponding to this request
 * @param confirmations (optional) Confirmations of the given `btcTxId`
 */

function computeIssueRequestStatus(
  completed: boolean,
  cancelled: boolean,
  creationBlock: BlockNumber,
  parachainHeight: BlockNumber,
  issuePeriod: BlockNumber,
  requiredBtcConfirmations: number,
  requestedRefund = false,
  btcTxId = '',
  confirmations = 0
): IssueRequestStatus {
  if (requestedRefund) {
    return IssueRequestStatus.RequestedRefund;
  }
  if (completed) {
    return IssueRequestStatus.Completed;
  }
  if (cancelled) {
    return IssueRequestStatus.Cancelled;
  }
  if (creationBlock.add(issuePeriod).lte(parachainHeight)) {
    return IssueRequestStatus.Expired;
  }

  if (btcTxId === '') {
    return IssueRequestStatus.PendingWithBtcTxNotFound;
  }
  if (confirmations === 0) {
    return IssueRequestStatus.PendingWithBtcTxNotIncluded;
  }
  if (confirmations < requiredBtcConfirmations) {
    return IssueRequestStatus.PendingWithTooFewConfirmations;
  }

  return IssueRequestStatus.PendingWithEnoughConfirmations;
}

/**
 * Converts an IssueRequest object retrieved from the parachain
 * to a UI IssueRequest object
 * @param id H256, the key of the IssueRequest object in the parachain map storage object
 * @param parachainIssueRequest ParachainIssueRequest
 * @param parachainHeight parachainHeight data (queried from the parachain)
 * @param redeemPeriod redeemPeriod data (queried from the parachain)
 * @param requiredBtcConfirmations requiredBtcConfirmations data (queried from the parachain)
 */

async function parachainToUIRedeemRequest(id: H256): Promise<RedeemRequest> {
  const [parachainRedeemRequest, parachainHeight, redeemPeriod, requiredBtcConfirmations] = await Promise.all([
    window.polkaBTC.redeem.getRequestById(id),
    window.polkaBTC.system.getCurrentBlockNumber(),
    window.polkaBTC.redeem.getRedeemPeriod(),
    window.polkaBTC.btcRelay.getStableBitcoinConfirmations()
  ]);
  const amountPolkaBTC = satToBTC(parachainRedeemRequest.amount_polka_btc.toString());
  const fee = satToBTC(parachainRedeemRequest.fee.toString());
  const status = computeRedeemRequestStatus(
    parachainRedeemRequest.completed.isTrue,
    parachainRedeemRequest.cancelled.isTrue,
    parachainRedeemRequest.reimburse.isTrue,
    parachainRedeemRequest.opentime,
    parachainHeight,
    redeemPeriod,
    requiredBtcConfirmations
  );
  return {
    id: stripHexPrefix(id.toString()),
    amountPolkaBTC,
    timestamp: formatDateTimePrecise(new Date(Date.now())),
    creation: parachainRedeemRequest.opentime.toString(),
    btcAddress: parachainRedeemRequest.btc_address,
    vaultDotAddress: parachainRedeemRequest.vault.toString(),
    btcTxId: '',
    fee,
    totalAmount: new Big(amountPolkaBTC).sub(new Big(fee)).toString(),
    confirmations: 0,
    status
  };
}

const statsToUIRedeemRequest = (
  statsRedeem: Redeem,
  currentBTCHeight: number,
  parachainHeight: BlockNumber,
  redeemPeriod: BlockNumber,
  requiredBtcConfirmations: number
): RedeemRequest => ({
  id: statsRedeem.id,
  amountPolkaBTC: statsRedeem.amountPolkaBTC,
  timestamp: statsRedeem.timestamp,
  creation: statsRedeem.creation,
  fee: statsRedeem.feePolkabtc,
  btcAddress: statsRedeem.btcAddress,
  vaultDotAddress: statsRedeem.vaultDotAddress,
  btcTxId: statsRedeem.btcTxId,
  totalAmount: new Big(statsRedeem.amountPolkaBTC).add(new Big(statsRedeem.feePolkabtc)).toString(),
  confirmations:
    // eslint-disable-next-line no-negated-condition
    statsRedeem.confirmations !== undefined ?
      statsRedeem.confirmations :
      statsRedeem.btcBlockHeight ?
        currentBTCHeight - statsRedeem.btcBlockHeight + 1 :
        0,
  status: computeRedeemRequestStatus(
    statsRedeem.completed,
    statsRedeem.cancelled,
    statsRedeem.reimbursed,
    window.polkaBTC.api.createType('BlockNumber', statsRedeem.creation),
    parachainHeight,
    redeemPeriod,
    requiredBtcConfirmations,
    statsRedeem.btcTxId,
    statsRedeem.confirmations
  )
});

/**
 * Given parameters about a redeem request, computes its status
 *
 * @param completed boolean
 * @param cancelled boolean
 * @param reimbursed boolean
 * @param creationBlock The number of the block where this request was included
 * @param parachainHeight Height of the parachain (number of blocks)
 * @param redeemPeriod issuePeriod data (queried from the parachain)
 * @param requiredBtcConfirmations requiredBtcConfirmations data (queried from the parachain)
 * @param btcTxId (optional) Bitcoin transaction ID corresponding to this request
 * @param confirmations (optional) Confirmations of the given `btcTxId` */

function computeRedeemRequestStatus(
  completed: boolean,
  cancelled: boolean,
  reimbursed: boolean,
  creationBlock: BlockNumber,
  parachainHeight: BlockNumber,
  redeemPeriod: BlockNumber,
  requiredBtcConfirmations: number,
  btcTxId = '',
  confirmations = 0
): RedeemRequestStatus {
  if (completed) {
    return RedeemRequestStatus.Completed;
  }
  if (reimbursed) {
    return RedeemRequestStatus.Reimbursed;
  }
  if (cancelled && !reimbursed) {
    return RedeemRequestStatus.Retried;
  }
  if (creationBlock.add(redeemPeriod).lte(parachainHeight)) {
    return RedeemRequestStatus.Expired;
  }
  if (btcTxId === '') {
    return RedeemRequestStatus.PendingWithBtcTxNotFound;
  }
  if (confirmations === 0) {
    return RedeemRequestStatus.PendingWithBtcTxNotIncluded;
  }
  if (confirmations < requiredBtcConfirmations) {
    return RedeemRequestStatus.PendingWithTooFewConfirmations;
  }

  return RedeemRequestStatus.PendingWithEnoughConfirmations;
}

/**
 * Checks whether string represents an integer or a floating point number
 * @remarks String of the form ".23" are not considered numeric. Use "0.23" instead.
 * @param s Arbitrary string
 * @return True if string is numeric, false otherwise.
 */

function isPositiveNumeric(s: string): boolean {
  const reg = new RegExp(NUMERIC_STRING_REGEX);
  return reg.test(s);
}

function range(start: number, end: number): number[] {
  return Array.from({ length: end - start }, (_, k) => k + start);
}

const arrayToMap = (arr: IssueRequest[][] | RedeemRequest[][]): Map<string, IssueRequest[] | RedeemRequest[]> => {
  const map = new Map();
  // eslint-disable-next-line guard-for-in
  for (const key in arr) {
    map.set(key, arr[key]);
  }
  return map;
};

interface DynamicObject {
  [key: string]: IssueRequest[] | RedeemRequest[];
}

const mapToArray = (map: Map<string, IssueRequest[] | RedeemRequest[]>): DynamicObject => {
  const result: DynamicObject = {};
  map.forEach((value, key) => {
    result[key] = value;
  });
  return result;
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

const BtcNetwork =
  BITCOIN_NETWORK === 'mainnet' ?
    bitcoin.networks.bitcoin :
    BITCOIN_NETWORK === 'testnet' ?
      bitcoin.networks.testnet :
      bitcoin.networks.regtest;

function reverseHashEndianness(hash: Uint8Array): string {
  return uint8ArrayToString(reverseEndianness(hash));
}

function defaultBlockData(): RelayedBlock {
  return {
    height: '0',
    hash: '',
    relay_ts: '0'
  };
}

function defaultTableDisplayParams<Column>(): TableDisplayParams<Column> {
  return {
    page: 0,
    perPage: 20
  };
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

const redeemRequestToVaultRedeem = (requests: Map<H256, ParachainRedeemRequest>): VaultRedeem[] => {
  const redeemRequests: VaultRedeem[] = [];
  requests.forEach((request, requestId) => {
    const [btcAddress, polkaBTC, unlockedDOT] = convertParachainTypes(request);
    redeemRequests.push({
      id: stripHexPrefix(requestId.toString()),
      timestamp: request.opentime.toString(),
      user: request.redeemer.toString(),
      btcAddress: btcAddress,
      polkaBTC: polkaBTC,
      unlockedDOT: unlockedDOT,
      status: 'Pending',
      cancelled: request.cancelled.isTrue,
      completed: request.completed.isTrue
    });
  });
  return redeemRequests;
};

const issueRequestToVaultIssue = (requests: Map<H256, ParachainIssueRequest>): VaultIssue[] => {
  const issueRequests: VaultIssue[] = [];
  requests.forEach((request, requestId) => {
    const [btcAddress, polkaBTC, lockedDOT] = convertParachainTypes(request);
    issueRequests.push({
      id: stripHexPrefix(requestId.toString()),
      timestamp: request.opentime.toString(),
      user: request.requester.toString(),
      btcAddress: btcAddress,
      polkaBTC: polkaBTC,
      lockedDOT: lockedDOT,
      status: 'Pending',
      cancelled: request.cancelled.isTrue,
      completed: request.completed.isTrue
    });
  });
  return issueRequests;
};

const requestsToVaultReplaceRequests = (requests: Map<H256, ParachainReplaceRequest>): VaultReplaceRequest[] => {
  const replaceRequests: VaultReplaceRequest[] = [];
  requests.forEach((request, requestId) => {
    const [btcAddress, polkaBTC, lockedDOT] = convertParachainTypes(request);
    replaceRequests.push({
      id: stripHexPrefix(requestId.toString()),
      timestamp: request.open_time.toString(),
      newVault: request.new_vault.toString(),
      oldVault: request.old_vault.toString(),
      btcAddress: btcAddress,
      polkaBTC: polkaBTC,
      lockedDOT: lockedDOT,
      status: request.accept_time.isSome ? 'Accepted' : 'Pending'
    });
  });
  return replaceRequests;
};

const updateBalances = async (
  dispatch: Dispatch,
  address: string,
  currentBalanceDOT: string,
  currentBalancePolkaBTC: string
): Promise<void> => {
  const accountId = window.polkaBTC.api.createType(ACCOUNT_ID_TYPE_NAME, address);
  const balancePolkaSAT = await window.polkaBTC.treasury.balancePolkaBTC(accountId);
  const balancePLANCK = await window.polkaBTC.collateral.balanceDOT(accountId);
  const balancePolkaBTC = satToBTC(balancePolkaSAT.toString());
  const balanceDOT = planckToDOT(balancePLANCK.toString());

  if (currentBalanceDOT !== balanceDOT) {
    dispatch(updateBalanceDOTAction(balanceDOT));
  }

  if (currentBalancePolkaBTC !== balancePolkaBTC) {
    dispatch(updateBalancePolkaBTCAction(balancePolkaBTC));
  }
};

const requestsInStore = (
  storeRequests: IssueRequest[] | RedeemRequest[],
  parachainRequests: IssueRequest[] | RedeemRequest[]
): boolean => {
  if (storeRequests.length !== parachainRequests.length) return false;
  let inStore = true;

  storeRequests.forEach((storeRequest: IssueRequest | RedeemRequest) => {
    let found = false;
    parachainRequests.forEach((parachainRequest: IssueRequest | RedeemRequest) => {
      if (storeRequest.id === parachainRequest.id) {
        found = true;
      }
    });
    if (!found) {
      inStore = false;
    }
  });
  return inStore;
};

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
};

const getRandomVaultIdWithCapacity = (vaults: [AccountId, Balance][], requiredCapacity: BN): string => {
  const filteredVaults = vaults.filter(vault => vault[1].gte(requiredCapacity));
  return filteredVaults.length > 0 ? getRandomArrayElement(filteredVaults)[0].toString() : '';
};

function getRandomArrayElement<T>(array: Array<T>): T {
  return array[Math.floor(Math.random() * array.length)];
}

export {
  safeRoundTwoDecimals,
  safeRoundEightDecimals,
  safeRoundFiveDecimals,
  shortAddress,
  shortTxId,
  formatDateTime,
  formatDateTimePrecise,
  getUsdAmount,
  displayBtcAmount,
  parachainToUIIssueRequest,
  statsToUIIssueRequest,
  computeIssueRequestStatus,
  parachainToUIRedeemRequest,
  statsToUIRedeemRequest,
  computeRedeemRequestStatus,
  isPositiveNumeric,
  range,
  arrayToMap,
  mapToArray,
  BtcNetwork,
  reverseHashEndianness,
  defaultBlockData,
  defaultTableDisplayParams,
  redeemRequestToVaultRedeem,
  issueRequestToVaultIssue,
  requestsToVaultReplaceRequests,
  updateBalances,
  requestsInStore,
  copyToClipboard,
  getRandomVaultIdWithCapacity,
  getRandomArrayElement
};

import { RedeemRequest } from '../types/redeem.types';
import { IssueRequest } from '../types/issue.types';
import {
  satToBTC,
  uint8ArrayToString,
  bitcoin,
  reverseEndianness,
  roundTwoDecimals
} from '@interlay/polkabtc';
import { NUMERIC_STRING_REGEX, BITCOIN_NETWORK, ACCOUNT_ID_TYPE_NAME } from '../../constants';
import { Dispatch } from 'redux';
import { updateBalanceDOTAction, updateBalancePolkaBTCAction } from '../actions/general.actions';
import Big from 'big.js';
import { TableDisplayParams, RelayedBlock } from '../types/util.types';
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
 * Checks whether string represents an integer or a floating point number
 * @remarks String of the form ".23" are not considered numeric. Use "0.23" instead.
 * @param {string} s Arbitrary string
 * @return {boolean} True if string is numeric, false otherwise.
 */
function isPositiveNumeric(s: string): boolean {
  const reg = new RegExp(NUMERIC_STRING_REGEX);
  return reg.test(s);
}

function range(start: number, end: number): number[] {
  return Array.from({ length: end - start }, (_, k) => k + start);
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

// ray test touch <
// TODO: should double-check
function defaultTableDisplayParams<Column>(): TableDisplayParams<Column> {
  return {
    page: 0,
    perPage: 20
  };
}
// ray test touch >

const updateBalances = async (
  dispatch: Dispatch,
  address: string,
  currentBalanceDOT: string,
  currentBalancePolkaBTC: string
): Promise<void> => {
  const accountId = window.polkaBTC.api.createType(ACCOUNT_ID_TYPE_NAME, address);
  const balancePolkaSAT = await window.polkaBTC.treasury.balancePolkaBTC(accountId);
  const balanceDOT = await window.polkaBTC.collateral.balance(accountId);
  const balancePolkaBTC = satToBTC(balancePolkaSAT.toString());

  if (currentBalanceDOT !== balanceDOT.toString()) {
    dispatch(updateBalanceDOTAction(balanceDOT.toString()));
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

const copyToClipboard = (text: string): void => {
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
  safeRoundFiveDecimals,
  safeRoundEightDecimals,
  shortAddress,
  shortTxId,
  formatDateTime,
  formatDateTimePrecise,
  getUsdAmount,
  displayBtcAmount,
  isPositiveNumeric,
  range,
  BtcNetwork,
  reverseHashEndianness,
  defaultBlockData,
  defaultTableDisplayParams,
  updateBalances,
  requestsInStore,
  copyToClipboard,
  getRandomVaultIdWithCapacity,
  getRandomArrayElement
};

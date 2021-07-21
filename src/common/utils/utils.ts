import {
  uint8ArrayToString,
  bitcoin,
  reverseEndianness,
  Issue,
  Redeem,
  CurrencyUnit
} from '@interlay/interbtc';
import { ACCOUNT_ID_TYPE_NAME } from 'config/general';
import { NUMERIC_STRING_REGEX, BITCOIN_NETWORK } from '../../constants';
import { Dispatch } from 'redux';
import { updateBalanceDOTAction, updateBalancePolkaBTCAction } from '../actions/general.actions';
import Big from 'big.js';
import { TableDisplayParams, RelayedBlock } from '../types/util.types';
import { AccountId } from '@polkadot/types/interfaces/runtime';
import { Bitcoin, BTCAmount, Currency, MonetaryAmount, Polkadot, PolkadotAmount } from '@interlay/monetary-js';

// TODO: should be one module
function safeRoundTwoDecimals(input: string | number | undefined, defaultValue = '0'): string {
  return safeRound(input, defaultValue, 2);
}

function safeRoundFiveDecimals(input: string | number | undefined, defaultValue = '0'): string {
  return safeRound(input, defaultValue, 5);
}

function safeRoundEightDecimals(input: string | number | undefined, defaultValue = '0'): string {
  return safeRound(input, defaultValue, 8);
}

function safeRound(input: string | number | undefined, defaultValue: string, decimals: number) {
  if (input === undefined) return defaultValue;
  try {
    const number = new Big(input);
    return number.round(decimals).toString();
  } catch {
    return defaultValue;
  }
}

function shortAddress(address: string): string {
  if (address.length < 12) return address;
  return address.substr(0, 6) + '...' + address.substr(address.length - 7, address.length - 1);
}

function shortTxId(txId: string): string {
  if (txId.length < 20) return txId;
  return txId.substr(0, 10) + '...' + txId.substr(txId.length - 11, txId.length - 1);
}

function formatDateTime(date: Date): string {
  return date.toDateString().substring(4) + ' ' + date.toTimeString().substring(0, 5);
}

// TODO: should use a package like `date-fns`
function formatDateTimePrecise(date: Date): string {
  return date.toDateString().substring(4) + ' ' + date.toTimeString().substring(0, 8);
}

// TODO: replace these functions with internationalization functions
// always round USD amounts to two decimals
function getUsdAmount<C extends CurrencyUnit>(
  amount: MonetaryAmount<Currency<C>, C>,
  rate: number
): string {
  return amount.toBig(amount.currency.base).mul(new Big(rate)).toFixed(2).toString();
}

function displayMonetaryAmount<C extends CurrencyUnit>(
  amount: MonetaryAmount<Currency<C>, C> | undefined,
  defaultValue = '0.00'
): string {
  if (amount === undefined) return defaultValue;

  // TODO: refactor once Monetary.js exposes an `isGreaterThanZero()` method
  const zero = new MonetaryAmount<Currency<C>, C>(
    amount.currency,
    0
  );
  if (amount.gte(zero)) {
    return amount.toHuman();
  }
  return defaultValue;
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
    relayTs: '0'
  };
}

// TODO: should double-check
function defaultTableDisplayParams<Column>(): TableDisplayParams<Column> {
  return {
    page: 0,
    perPage: 20
  };
}

const updateBalances = async (
  dispatch: Dispatch,
  address: string,
  currentBalanceDOT: PolkadotAmount,
  currentBalancePolkaBTC: BTCAmount
): Promise<void> => {
  const accountId = window.polkaBTC.api.createType(ACCOUNT_ID_TYPE_NAME, address);
  const balanceInterBTC = await window.polkaBTC.tokens.balance(Bitcoin, accountId);
  const balanceDOT = await window.polkaBTC.tokens.balance(Polkadot, accountId);

  if (currentBalanceDOT !== balanceDOT) {
    dispatch(updateBalanceDOTAction(balanceDOT));
  }

  if (currentBalancePolkaBTC !== balanceInterBTC) {
    dispatch(updateBalancePolkaBTCAction(balanceInterBTC));
  }
};

const requestsInStore = (
  storeRequests: Issue[] | Redeem[],
  parachainRequests: Issue[] | Redeem[]
): boolean => {
  if (storeRequests.length !== parachainRequests.length) return false;
  let inStore = true;

  storeRequests.forEach((storeRequest: Issue | Redeem) => {
    let found = false;
    parachainRequests.forEach((parachainRequest: Issue | Redeem) => {
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

const getRandomVaultIdWithCapacity = (vaults: [AccountId, BTCAmount][], requiredCapacity: BTCAmount): string => {
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
  displayMonetaryAmount,
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

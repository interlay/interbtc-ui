import { payments, networks } from 'bitcoinjs-lib';
import Big from 'big.js';
import { Issue, Redeem, CurrencyUnit, InterbtcPrimitivesVaultId } from '@interlay/interbtc-api';
import { BitcoinAmount, Currency, MonetaryAmount } from '@interlay/monetary-js';

import { NUMERIC_STRING_REGEX, PARACHAIN_URL } from '../../constants';
import { BitcoinNetwork } from 'types/bitcoin';

// TODO: should be one module
function safeRoundTwoDecimals(input: string | number | undefined, defaultValue = '0'): string {
  return safeRound(input, defaultValue, 2);
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

function getLastMidnightTimestamps(daysBack: number, startFromTonight = false): Array<Date> {
  return [...Array(daysBack).keys()]
    .map((index) => {
      const timestamp = Date.now() - (startFromTonight ? index - 1 : index) * 3600 * 24 * 1000;
      const partialDay = timestamp % (86400 * 1000); // Modulo ms per day
      return new Date(timestamp - partialDay);
    })
    .reverse();
}

// TODO: replace these functions with internationalization functions
// Always round USD amounts to two decimals
function getUsdAmount<C extends CurrencyUnit>(
  amount: MonetaryAmount<Currency<C>, C>,
  rate: number | undefined
): string {
  // If price data is unavailable dash is shown
  if (rate === undefined) {
    return '—';
  }
  return amount.toBig(amount.currency.base).mul(new Big(rate)).toFixed(2).toString();
}

function displayMonetaryAmount<C extends CurrencyUnit>(
  amount: MonetaryAmount<Currency<C>, C> | undefined,
  defaultValue = '0.00'
): string {
  if (amount === undefined) return defaultValue;

  // TODO: refactor once Monetary.js exposes an `isGreaterThanZero()` method
  const zero = new MonetaryAmount<Currency<C>, C>(amount.currency, 0);
  if (amount.gte(zero)) {
    return amount.toHuman();
  }
  return defaultValue;
}

// ray test touch <
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

const requestsInStore = (storeRequests: Issue[] | Redeem[], parachainRequests: Issue[] | Redeem[]): boolean => {
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

const btcAddressFromEventToString = (addressObject: string, network: BitcoinNetwork): string => {
  const parsedAddress = JSON.parse(addressObject);
  const hexHash = Object.values<string>(parsedAddress)[0];
  const hash = Buffer.from(
    hexHash.substring(2), // Remove hex prefix
    'hex'
  );
  const paymentType = Object.keys(parsedAddress)[0].toUpperCase();

  let payment;
  switch (paymentType) {
    case 'P2WPKHV0':
      payment = payments.p2wpkh;
      break;
    case 'P2PKH':
      payment = payments.p2pkh;
      break;
    case 'P2SH':
      payment = payments.p2sh;
      break;
    default:
      throw new Error('Something went wrong!');
  }

  return (
    payment({
      hash,
      network: networks[network === BitcoinNetwork.Mainnet ? 'bitcoin' : network]
    }).address || ''
  );
};
// ray test touch >

const copyToClipboard = (text: string): void => {
  navigator.clipboard.writeText(text);
};

const getRandomVaultIdWithCapacity = (
  vaults: [InterbtcPrimitivesVaultId, BitcoinAmount][],
  requiredCapacity: BitcoinAmount
): InterbtcPrimitivesVaultId => {
  const filteredVaults = vaults.filter((vault) => vault[1].gte(requiredCapacity));
  if (filteredVaults.length === 0) {
    throw new Error('No available vaults with required issue capacity.');
  }
  return getRandomArrayElement(filteredVaults)[0];
};

function getRandomArrayElement<T>(array: Array<T>): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getPolkadotLink(blockHeight: number): string {
  return `https://polkadot.js.org/apps/?rpc=${PARACHAIN_URL}#/explorer/query/${blockHeight}`;
}

export {
  safeRoundTwoDecimals,
  shortAddress,
  shortTxId,
  formatDateTime,
  formatDateTimePrecise,
  getLastMidnightTimestamps,
  getUsdAmount,
  displayMonetaryAmount,
  isPositiveNumeric,
  range,
  btcAddressFromEventToString,
  requestsInStore,
  copyToClipboard,
  getRandomVaultIdWithCapacity,
  // ray test touch <
  getRandomArrayElement,
  // ray test touch >
  getPolkadotLink
};

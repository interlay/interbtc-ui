import { CurrencyUnit, InterbtcPrimitivesVaultId } from '@interlay/interbtc-api';
import { BitcoinAmount, Currency, MonetaryAmount } from '@interlay/monetary-js';
import Big from 'big.js';

import { PARACHAIN_URL } from '@/constants';

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
const convertMonetaryAmountToValueInUSD = <C extends CurrencyUnit>(
  amount: MonetaryAmount<Currency<C>, C>,
  rate: number | undefined
): number | null => {
  // If the rate is not available
  if (rate === undefined) {
    return null;
  }

  return amount.toBig(amount.currency.base).mul(new Big(rate)).toNumber();
};

const formatUSD = (amount: number): string => {
  const { format } = new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD'
  });

  return format(amount);
};

// ray test touch <
// Always round USD amounts to two decimals
function getUsdAmount<C extends CurrencyUnit>(
  amount: MonetaryAmount<Currency<C>, C>,
  rate: number | undefined
): string {
  // If price data is unavailable dash is shown
  if (rate === undefined) {
    return '—';
  }

  const rawUSDAmount = amount.toBig(amount.currency.base).mul(new Big(rate)).toNumber();

  return rawUSDAmount.toLocaleString(undefined, { maximumFractionDigits: 2 });
}
// ray test touch >

// ray test touch <
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
  convertMonetaryAmountToValueInUSD,
  copyToClipboard,
  displayMonetaryAmount,
  formatDateTime,
  formatDateTimePrecise,
  formatUSD,
  getLastMidnightTimestamps,
  getPolkadotLink,
  getRandomVaultIdWithCapacity,
  getUsdAmount,
  safeRoundTwoDecimals,
  shortAddress,
  shortTxId
};

import { CurrencyExt, InterbtcPrimitivesVaultId } from '@interlay/interbtc-api';
import { BitcoinAmount, MonetaryAmount } from '@interlay/monetary-js';
import Big from 'big.js';

import { PARACHAIN_URL } from '@/constants';

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

const convertMonetaryAmountToValueInUSD = <T extends CurrencyExt>(
  amount: MonetaryAmount<T>,
  rate: number | undefined
): number | null => {
  // If the rate is not available
  if (rate === undefined) {
    return null;
  }

  return amount.toBig().mul(new Big(rate)).toNumber();
};

const formatUSD = (amount: number): string => {
  const { format } = new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD'
  });

  return format(amount);
};

function displayMonetaryAmountInUSDFormat<T extends CurrencyExt>(
  amount: MonetaryAmount<T>,
  rate: number | undefined
): string {
  // If the rate is not available
  if (rate === undefined) {
    return '—';
  }

  const rawUSDAmount = convertMonetaryAmountToValueInUSD(amount, rate);

  if (rawUSDAmount === null) {
    throw new Error('Something went wrong!');
  }

  return formatUSD(rawUSDAmount);
}

const formatNumber = (
  amount: number,
  options?: {
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  }
): string => {
  const { format } = new Intl.NumberFormat(undefined, options);

  return format(amount);
};

const formatPercentage = (
  percentage: number,
  options?: {
    maximumFractionDigits?: number;
    minimumFractionDigits?: number;
  }
): string => {
  const { format } = new Intl.NumberFormat(undefined, {
    style: 'percent',
    maximumFractionDigits: options?.maximumFractionDigits ?? 2,
    minimumFractionDigits: options?.minimumFractionDigits ?? 2
  });

  return format(percentage);
};

function displayMonetaryAmount(amount: MonetaryAmount<CurrencyExt> | undefined, defaultValue = '0.00'): string {
  if (amount === undefined) return defaultValue;

  // TODO: refactor once Monetary.js exposes an `isGreaterThanZero()` method
  const zero = new MonetaryAmount<CurrencyExt>(amount.currency, 0);
  if (amount.gte(zero)) {
    return formatNumber(Number(amount.toHuman()));
  }

  return defaultValue;
}

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
  displayMonetaryAmountInUSDFormat,
  formatDateTime,
  formatDateTimePrecise,
  formatNumber,
  formatPercentage,
  formatUSD,
  getLastMidnightTimestamps,
  getPolkadotLink,
  getRandomVaultIdWithCapacity,
  shortAddress,
  shortTxId
};

import { CurrencyExt, InterbtcPrimitivesVaultId, newMonetaryAmount } from '@interlay/interbtc-api';
import { BitcoinAmount, MonetaryAmount } from '@interlay/monetary-js';
import Big, { BigSource } from 'big.js';

import { PARACHAIN_URL } from '@/constants';
import { getTokenPrice } from '@/utils/helpers/prices';
import { Prices } from '@/utils/hooks/api/use-get-prices';

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

const convertMonetaryAmountToUsdBig = <T extends CurrencyExt>(
  amount: MonetaryAmount<T>,
  rate: number | undefined
): Big => {
  // If the rate is not available return 0.
  if (rate === undefined) {
    return Big(0);
  }

  return amount.toBig().mul(rate);
};

const convertMonetaryBtcToUSD = (amount: BitcoinAmount, prices: Prices): Big => {
  if (prices === undefined) {
    return Big(0);
  }

  const btcUsdPrice = getTokenPrice(prices, 'BTC')?.usd;
  return convertMonetaryAmountToUsdBig(amount, btcUsdPrice);
};

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

const getFormatUSDNotation = (amount: number) => {
  const amountLength = amount.toFixed(0).length;

  return amountLength >= 6 ? 'compact' : 'standard';
};

const formatUSD = (amount: number, options?: { compact?: boolean }): string => {
  const { format } = new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD',
    notation: options?.compact ? getFormatUSDNotation(amount) : undefined
  });

  return format(amount);
};

function displayMonetaryAmountInUSDFormat<T extends CurrencyExt>(
  amount: MonetaryAmount<T> | undefined,
  rate: number | undefined
): string {
  // If the rate is not available
  if (rate === undefined || amount === undefined) {
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
    compact?: boolean;
  }
): string => {
  const { format } = new Intl.NumberFormat(undefined, {
    ...options,
    notation: options?.compact ? getFormatUSDNotation(amount) : undefined
  });

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
    style: 'decimal',
    maximumFractionDigits: options?.maximumFractionDigits ?? 2,
    minimumFractionDigits: options?.minimumFractionDigits ?? 2
  });

  return `${format(percentage)}%`;
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

const monetaryToNumber = (monetaryAmount: MonetaryAmount<CurrencyExt> | undefined): number =>
  monetaryAmount?.toBig().toNumber() || 0;

const newSafeMonetaryAmount: typeof newMonetaryAmount = (...args) => {
  try {
    return newMonetaryAmount(...args);
  } catch (e) {
    const [, ...rest] = args;
    return newMonetaryAmount(0, ...rest);
  }
};

const safeBitcoinAmount = (amount: BigSource): BitcoinAmount => {
  try {
    return new BitcoinAmount(amount);
  } catch (e) {
    return new BitcoinAmount(0);
  }
};

export {
  convertMonetaryAmountToUsdBig as convertMonetaryAmountToBigUSD,
  convertMonetaryAmountToValueInUSD,
  convertMonetaryBtcToUSD,
  displayMonetaryAmount,
  displayMonetaryAmountInUSDFormat,
  formatDateTime,
  formatDateTimePrecise,
  formatNumber,
  formatPercentage,
  formatUSD,
  getLastMidnightTimestamps,
  getPolkadotLink,
  getRandomArrayElement,
  getRandomVaultIdWithCapacity,
  monetaryToNumber,
  newSafeMonetaryAmount,
  safeBitcoinAmount,
  shortAddress,
  shortTxId
};

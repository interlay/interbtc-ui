import { CurrencyExt } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';

import { BLOCK_TIME } from '@/config/parachain';

const ONE_WEEK_SECONDS = 7 * 24 * 3600;

const convertWeeksToBlockNumbers = (weeks: number) => {
  return (weeks * ONE_WEEK_SECONDS) / BLOCK_TIME;
};

const convertBlockNumbersToWeeks = (blockNumbers: number) => {
  return (blockNumbers * BLOCK_TIME) / ONE_WEEK_SECONDS;
};

// When to increase lock amount and extend lock time
const checkIncreaseLockAmountAndExtendLockTime = (lockTime: number, lockAmount: MonetaryAmount<CurrencyExt>) => {
  return lockTime > 0 && !lockAmount.isZero();
};
// When to only increase lock amount
const checkOnlyIncreaseLockAmount = (lockTime: number, lockAmount: MonetaryAmount<CurrencyExt>) => {
  return lockTime === 0 && !lockAmount.isZero();
};
// When to only extend lock time
const checkOnlyExtendLockTime = (lockTime: number, lockAmount: MonetaryAmount<CurrencyExt>) => {
  return lockTime > 0 && lockAmount.isZero();
};

export {
  checkIncreaseLockAmountAndExtendLockTime,
  checkOnlyExtendLockTime,
  checkOnlyIncreaseLockAmount,
  convertBlockNumbersToWeeks,
  convertWeeksToBlockNumbers
};

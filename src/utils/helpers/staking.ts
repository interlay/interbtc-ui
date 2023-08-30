import { BLOCK_TIME } from '@/config/parachain';

const ONE_WEEK_SECONDS = 7 * 24 * 3600;

const convertWeeksToBlockNumbers = (weeks: number): number => {
  return (weeks * ONE_WEEK_SECONDS) / BLOCK_TIME;
};

const convertBlockNumbersToWeeks = (blockNumbers: number): number => {
  return (blockNumbers * BLOCK_TIME) / ONE_WEEK_SECONDS;
};

export { convertBlockNumbersToWeeks, convertWeeksToBlockNumbers };

import { ChainBalance } from '@interlay/interbtc-api';

type BalanceData = {
  [ticker: string]: ChainBalance;
};

export type { BalanceData };

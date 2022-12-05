import { BorrowPosition as LibBorrowPosition, LendPosition as LibLendPosition } from '@interlay/interbtc-api';
import Big from 'big.js';

type ExtendPosition = {
  amountUSD: Big;
  rewardsApy: Big;
  totalApy: Big;
};

type LendPositionExt = LibLendPosition & Partial<ExtendPosition>;

type BorrowPositionExt = LibBorrowPosition & Partial<ExtendPosition>;

export type { BorrowPositionExt, LendPositionExt };

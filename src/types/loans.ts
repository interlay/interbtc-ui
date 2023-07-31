import {
  AccruedRewards,
  BorrowPosition,
  CollateralPosition as LibCollateralPosition,
  CurrencyExt,
  LendingStats,
  LoanAsset,
  TickerToData
} from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';

type Lend = 'lend';

type Borrow = 'borrow';

type LoanType = Lend | Borrow;

type LendAction = Lend | 'withdraw';

type BorrowAction = Borrow | 'repay';

type LoanAction = LendAction | BorrowAction;

interface CollateralPosition extends LibCollateralPosition {
  earnedAmount?: MonetaryAmount<CurrencyExt>;
}

export type {
  AccruedRewards,
  BorrowAction,
  BorrowPosition,
  CollateralPosition,
  LendAction,
  LendingStats,
  LoanAction,
  LoanAsset,
  LoanType,
  TickerToData
};

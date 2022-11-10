import { ReactNode } from 'react';

// LEND

enum LendAssetsColumns {
  ASSET = 'asset',
  APY = 'apy',
  WALLET = 'wallet',
  COLLATERAL = 'collateral'
}

type LendAssetsTableRow = {
  id: number | string;
  [LendAssetsColumns.ASSET]: ReactNode;
  [LendAssetsColumns.APY]: ReactNode;
  [LendAssetsColumns.WALLET]: ReactNode;
  [LendPositionColumns.COLLATERAL]: ReactNode;
};

enum LendPositionColumns {
  ASSET = 'asset',
  APY_EARNED = 'apy-earned',
  BALANCE = 'balance',
  COLLATERAL = 'collateral'
}

type LendPositionTableRow = {
  id: number;
  [LendPositionColumns.ASSET]: ReactNode;
  [LendPositionColumns.APY_EARNED]: ReactNode;
  [LendPositionColumns.BALANCE]: ReactNode;
  [LendPositionColumns.COLLATERAL]: ReactNode;
};

// BORROW

enum BorrowAssetsColumns {
  ASSET = 'asset',
  APY = 'apy',
  WALLET = 'wallet',
  LIQUIDITY = 'liquidity'
}

type BorrowAssetsTableRow = {
  id: string;
  [BorrowAssetsColumns.ASSET]: ReactNode;
  [BorrowAssetsColumns.APY]: ReactNode;
  [BorrowAssetsColumns.WALLET]: ReactNode;
  [BorrowAssetsColumns.LIQUIDITY]: string;
};

enum BorrowPositionColumns {
  ASSET = 'asset',
  APY_ACCRUED = 'apy-accrued',
  BALANCE = 'balance',
  STATUS = 'status'
}

type BorrowPositionTableRow = {
  id: number;
  [BorrowPositionColumns.ASSET]: ReactNode;
  [BorrowPositionColumns.APY_ACCRUED]: ReactNode;
  [BorrowPositionColumns.BALANCE]: ReactNode;
  [BorrowPositionColumns.STATUS]: ReactNode;
};

export { BorrowAssetsColumns, BorrowPositionColumns, LendAssetsColumns, LendPositionColumns };
export type { BorrowAssetsTableRow, BorrowPositionTableRow, LendAssetsTableRow, LendPositionTableRow };

import { ReactNode } from 'react';

// LEND

enum LendAssetsColumns {
  ASSET = 'asset',
  APY = 'apy',
  WALLET_BALANCE = 'wallet-balance'
}

type LendAssetsTableRow = {
  id: number;
  [LendAssetsColumns.ASSET]: ReactNode;
  [LendAssetsColumns.APY]: ReactNode;
  [LendAssetsColumns.WALLET_BALANCE]: string;
};

enum LendPositionColumns {
  ASSET = 'asset',
  SUPPLIED = 'supplied',
  SUPPLY_APY = 'supply-apy',
  APY_EARNED = 'apy-earned'
}

type LendPositionTableRow = {
  id: number;
  [LendPositionColumns.ASSET]: ReactNode;
  [LendPositionColumns.SUPPLIED]: string;
  [LendPositionColumns.SUPPLY_APY]: string;
  [LendPositionColumns.APY_EARNED]: string;
};

// BORROW

enum BorrowAssetsColumns {
  ASSET = 'asset',
  BORROW_APY = 'borrow-apy',
  AVAILABLE = 'available',
  LIQUIDITY = 'liquidity'
}

type BorrowAssetsTableRow = {
  id: number;
  [BorrowAssetsColumns.ASSET]: ReactNode;
  [BorrowAssetsColumns.BORROW_APY]: string;
  [BorrowAssetsColumns.AVAILABLE]: string;
  [BorrowAssetsColumns.LIQUIDITY]: string;
};

enum BorrowPositionColumns {
  ASSET = 'asset',
  BORROWED = 'borrowed',
  BORROW_APY = 'borrow-apy'
}

type BorrowPositionTableRow = {
  id: number;
  [BorrowPositionColumns.ASSET]: ReactNode;
  [BorrowPositionColumns.BORROWED]: string;
  [BorrowPositionColumns.BORROW_APY]: string;
};

export { BorrowAssetsColumns, BorrowPositionColumns, LendAssetsColumns, LendPositionColumns };
export type { BorrowAssetsTableRow, BorrowPositionTableRow, LendAssetsTableRow, LendPositionTableRow };

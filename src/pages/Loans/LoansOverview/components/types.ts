import { ReactNode } from 'react';

type LoanTableRow = {
  id: string;
};

enum LendAssetsColumns {
  ASSET = 'asset',
  APY = 'apy',
  WALLET = 'wallet',
  LIQUIDITY = 'liquidity'
}

type LendAssetsTableRow = LoanTableRow & {
  [LendAssetsColumns.ASSET]: ReactNode;
  [LendAssetsColumns.APY]: ReactNode;
  [LendAssetsColumns.WALLET]: ReactNode;
  [LendAssetsColumns.LIQUIDITY]: ReactNode;
};

enum LendPositionColumns {
  ASSET = 'asset',
  APY_EARNED = 'apy-earned',
  BALANCE = 'balance',
  COLLATERAL = 'collateral'
}

type LendPositionTableRow = LoanTableRow & {
  [LendPositionColumns.ASSET]: ReactNode;
  [LendPositionColumns.APY_EARNED]: ReactNode;
  [LendPositionColumns.BALANCE]: ReactNode;
  [LendPositionColumns.COLLATERAL]: ReactNode;
};

enum BorrowAssetsColumns {
  ASSET = 'asset',
  APY = 'apy',
  WALLET = 'wallet',
  LIQUIDITY = 'liquidity'
}

type BorrowAssetsTableRow = LoanTableRow & {
  [BorrowAssetsColumns.ASSET]: ReactNode;
  [BorrowAssetsColumns.APY]: ReactNode;
  [BorrowAssetsColumns.WALLET]: ReactNode;
  [BorrowAssetsColumns.LIQUIDITY]: ReactNode;
};

enum BorrowPositionColumns {
  ASSET = 'asset',
  APY_ACCRUED = 'apy-accrued',
  BALANCE = 'balance',
  STATUS = 'status'
}

type BorrowPositionTableRow = LoanTableRow & {
  [BorrowPositionColumns.ASSET]: ReactNode;
  [BorrowPositionColumns.APY_ACCRUED]: ReactNode;
  [BorrowPositionColumns.BALANCE]: ReactNode;
  [BorrowPositionColumns.STATUS]: ReactNode;
};

export { BorrowAssetsColumns, BorrowPositionColumns, LendAssetsColumns, LendPositionColumns };
export type { BorrowAssetsTableRow, BorrowPositionTableRow, LendAssetsTableRow, LendPositionTableRow };

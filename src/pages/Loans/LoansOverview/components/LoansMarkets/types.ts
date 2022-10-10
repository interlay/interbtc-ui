import { ReactNode } from 'react';

// SUPPLY

enum SupplyAssetsColumns {
  ASSET = 'asset',
  APY = 'apy',
  WALLET_BALANCE = 'wallet-balance'
}

type SupplyAssetsTableRow = {
  id: number;
  [SupplyAssetsColumns.ASSET]: ReactNode;
  [SupplyAssetsColumns.APY]: ReactNode;
  [SupplyAssetsColumns.WALLET_BALANCE]: string;
};

enum SupplyPositionColumns {
  ASSET = 'asset',
  SUPPLIED = 'supplied',
  SUPPLY_APY = 'supply-apy',
  APY_EARNED = 'apy-earned'
}

type SupplyPositionTableRow = {
  id: number;
  [SupplyPositionColumns.ASSET]: ReactNode;
  [SupplyPositionColumns.SUPPLIED]: string;
  [SupplyPositionColumns.SUPPLY_APY]: string;
  [SupplyPositionColumns.APY_EARNED]: string;
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

export { BorrowAssetsColumns, BorrowPositionColumns, SupplyAssetsColumns, SupplyPositionColumns };
export type { BorrowAssetsTableRow, BorrowPositionTableRow, SupplyAssetsTableRow, SupplyPositionTableRow };

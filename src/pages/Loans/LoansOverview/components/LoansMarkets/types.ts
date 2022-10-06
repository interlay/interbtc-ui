import { ReactNode } from 'react';

enum SupplyAssetsColumns {
  ASSET = 'asset',
  APY = 'apy',
  WALLET_BALANCE = 'wallet-balance',
  END_ADORNMENT = 'end-adornment'
}

type SupplyAssetsTableRow = {
  id: number;
  [SupplyAssetsColumns.ASSET]: ReactNode;
  [SupplyAssetsColumns.APY]: ReactNode;
  [SupplyAssetsColumns.WALLET_BALANCE]: string;
  [SupplyAssetsColumns.END_ADORNMENT]: ReactNode;
};

enum SupplyPositionColumns {
  ASSET = 'asset',
  SUPPLIED = 'supplied',
  SUPPLY_APY = 'supply-apy',
  APY_EARNED = 'apy-earned',
  END_ADORNMENT = 'end-adornment'
}

type SupplyPositionTableRow = {
  id: number;
  [SupplyPositionColumns.ASSET]: ReactNode;
  [SupplyPositionColumns.SUPPLIED]: string;
  [SupplyPositionColumns.SUPPLY_APY]: string;
  [SupplyPositionColumns.APY_EARNED]: string;
  [SupplyPositionColumns.APY_EARNED]: string;
  [SupplyPositionColumns.END_ADORNMENT]: ReactNode;
};

export { SupplyAssetsColumns, SupplyPositionColumns };
export type { SupplyAssetsTableRow, SupplyPositionTableRow };

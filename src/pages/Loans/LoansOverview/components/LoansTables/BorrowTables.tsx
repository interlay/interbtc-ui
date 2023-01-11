import { BorrowPosition, LoanAsset, TickerToData } from '@interlay/interbtc-api';
import { Key, useState } from 'react';

import { getPosition } from '../../utils/get-position';
import { BorrowAssetsTable } from '../BorrowAssetsTable';
import { BorrowPositionsTable } from '../BorrowPositionsTable';
import { LoanModal } from '../LoanModal';

type UseAssetState = {
  data?: LoanAsset;
  position?: BorrowPosition;
};

const defaultAssetState: UseAssetState = { data: undefined, position: undefined };

type BorrowTablesProps = {
  assets: TickerToData<LoanAsset>;
  positions: BorrowPosition[];
  disabledAssets: string[];
  hasPositions: boolean;
};

const BorrowTables = ({ assets, positions, disabledAssets, hasPositions }: BorrowTablesProps): JSX.Element => {
  const [selectedAsset, setAsset] = useState<UseAssetState>(defaultAssetState);

  const handleRowAction = (ticker: Key) => {
    const asset = assets[ticker as string];
    const position = getPosition(positions, ticker as string);

    setAsset({ data: asset, position });
  };

  const handleClose = () => setAsset(defaultAssetState);

  return (
    <>
      {hasPositions && (
        <BorrowPositionsTable
          assets={assets}
          positions={positions}
          onRowAction={handleRowAction}
          disabledKeys={disabledAssets}
        />
      )}
      <BorrowAssetsTable assets={assets} onRowAction={handleRowAction} disabledKeys={disabledAssets} />
      <LoanModal
        variant='borrow'
        isOpen={!!selectedAsset.data}
        asset={selectedAsset.data}
        position={selectedAsset.position}
        onClose={handleClose}
      />
    </>
  );
};

export { BorrowTables };
export type { BorrowTablesProps };

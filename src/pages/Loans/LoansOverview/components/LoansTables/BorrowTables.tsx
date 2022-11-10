import { BorrowPosition, LoanAsset, TickerToData } from '@interlay/interbtc-api';
import { Key, useState } from 'react';

import { BorrowAssetsTable } from '../BorrowAssetsTable';
import { BorrowPositionsTable } from '../BorrowPositionsTable';
import { LoanModal } from '../LoanModal';
import { StyledTableWrapper } from './LoansTables.style';

type UseAssetState = {
  data?: LoanAsset;
  position?: BorrowPosition;
};

const defaultAssetState: UseAssetState = { data: undefined, position: undefined };

type BorrowTablesProps = {
  assets: TickerToData<LoanAsset>;
  positions: BorrowPosition[];
};

const BorrowTables = ({ assets, positions }: BorrowTablesProps): JSX.Element => {
  const [selectedAsset, setAsset] = useState<UseAssetState>(defaultAssetState);

  // TODO: subject to change in the future
  const handleAssetRowAction = (key: Key) => {
    const asset = assets[key as string];
    const position = positions.find((position) => position.currency === asset.currency);

    setAsset({ data: asset, position });
  };

  // TODO: subject to change in the future
  const handlePositionRowAction = (key: Key) => {
    const position = positions[key as number];
    const asset = assets[position.currency.ticker];

    setAsset({ data: asset, position });
  };

  const handleClose = () => setAsset(defaultAssetState);

  return (
    <StyledTableWrapper spacing='double'>
      <BorrowPositionsTable assets={assets} positions={positions} onRowAction={handlePositionRowAction} />
      <BorrowAssetsTable assets={assets} positions={positions} onRowAction={handleAssetRowAction} />
      <LoanModal
        variant='borrow'
        open={!!selectedAsset.data}
        asset={selectedAsset.data}
        position={selectedAsset.position}
        onClose={handleClose}
      />
    </StyledTableWrapper>
  );
};

export { BorrowTables };
export type { BorrowTablesProps };

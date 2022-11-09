import { LendPosition, LoanAsset, TickerToData } from '@interlay/interbtc-api';
import { Key, useState } from 'react';

import { LendAssetsTable } from '../LendAssetsTable/LendAssetsTable';
import { LendPositionsTable } from '../LendPositionsTable';
import { LoanModal } from '../LoanModal';
import { StyledTableWrapper } from './LoansTables.style';

type UseAssetState = {
  data?: LoanAsset;
  position?: LendPosition;
};

const defaultAssetState: UseAssetState = { data: undefined, position: undefined };

type LendTablesProps = {
  assets: TickerToData<LoanAsset>;
  positions: LendPosition[];
};

const LendTables = ({ assets, positions }: LendTablesProps): JSX.Element => {
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
      <LendPositionsTable assets={assets} positions={positions} onRowAction={handlePositionRowAction} />
      <LendAssetsTable assets={assets} positions={positions} onRowAction={handleAssetRowAction} />
      <LoanModal
        variant='lend'
        open={!!selectedAsset.data}
        asset={selectedAsset.data}
        position={selectedAsset.position}
        onClose={handleClose}
      />
    </StyledTableWrapper>
  );
};

export { LendTables };
export type { LendTablesProps };

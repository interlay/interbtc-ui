import { CollateralPosition, LoanAsset, TickerToData } from '@interlay/interbtc-api';
import { Key, useState } from 'react';

import { getPosition } from '../../utils/get-position';
import { CollateralModal } from '../CollateralModal';
import { LoanModal } from '../LoanModal';
import { StyledLendAssetsTable, StyledLendPositionsTable } from './LoansTables.style';

type UseAssetState = {
  type?: 'toggle-collateral' | 'change-loan';
  data?: LoanAsset;
  position?: CollateralPosition;
};

const defaultAssetState: UseAssetState = { type: undefined, data: undefined, position: undefined };

type LendTablesProps = {
  assets: TickerToData<LoanAsset>;
  positions: CollateralPosition[];
  disabledAssets: string[];
  hasPositions: boolean;
};

const LendTables = ({ assets, positions, disabledAssets, hasPositions }: LendTablesProps): JSX.Element => {
  const [selectedAsset, setAsset] = useState<UseAssetState>(defaultAssetState);

  const handleRowAction = (ticker: Key) => {
    const asset = assets[ticker as string];
    const position = getPosition(positions, ticker as string);

    setAsset({ type: 'change-loan', data: asset, position });
  };

  const handlePressCollateralSwitch = (ticker: string) => {
    const asset = assets[ticker];
    const position = getPosition(positions, ticker);

    setAsset({ type: 'toggle-collateral', data: asset, position });
  };

  const handleClose = () => setAsset(defaultAssetState);

  return (
    <>
      {hasPositions && (
        <StyledLendPositionsTable
          variant='lend'
          assets={assets}
          positions={positions}
          onRowAction={handleRowAction}
          onPressCollateralSwitch={handlePressCollateralSwitch}
          disabledKeys={disabledAssets}
        />
      )}
      <StyledLendAssetsTable assets={assets} onRowAction={handleRowAction} disabledKeys={disabledAssets} />
      <LoanModal
        variant='lend'
        isOpen={selectedAsset.type === 'change-loan'}
        asset={selectedAsset.data}
        position={selectedAsset.position}
        onClose={handleClose}
      />
      {selectedAsset.data && selectedAsset.position && (
        <CollateralModal
          isOpen={selectedAsset.type === 'toggle-collateral'}
          asset={selectedAsset.data}
          position={selectedAsset.position}
          onClose={handleClose}
        />
      )}
    </>
  );
};

export { LendTables };
export type { LendTablesProps };

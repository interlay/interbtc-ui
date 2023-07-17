import { CollateralPosition, LoanAsset, TickerToData } from '@interlay/interbtc-api';
import { Key, useState } from 'react';

import { getPosition } from '../../utils/get-position';
import { CollateralModal } from '../CollateralModal';
import { LoanModal } from '../LoanModal';
import { StyledLendAssetsTable, StyledLendPositionsTable } from './LoansTables.style';

type UseAssetState = {
  isOpen: boolean;
  type?: 'toggle-collateral' | 'change-loan';
  data?: LoanAsset;
  position?: CollateralPosition;
};

type LendTablesProps = {
  assets: TickerToData<LoanAsset>;
  positions: CollateralPosition[];
  disabledAssets: string[];
  hasPositions: boolean;
};

const LendTables = ({ assets, positions, disabledAssets, hasPositions }: LendTablesProps): JSX.Element => {
  const [selectedAsset, setAsset] = useState<UseAssetState>({ isOpen: false });

  const handleRowAction = (ticker: Key) => {
    const asset = assets[ticker as string];
    const position = getPosition(positions, ticker as string);

    setAsset({ isOpen: true, type: 'change-loan', data: asset, position });
  };

  const handlePressCollateralSwitch = (ticker: string) => {
    const asset = assets[ticker];
    const position = getPosition(positions, ticker);

    setAsset({ isOpen: true, type: 'toggle-collateral', data: asset, position });
  };

  const handleClose = () => setAsset((s) => ({ ...s, isOpen: false }));

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
        isOpen={selectedAsset.isOpen && selectedAsset.type === 'change-loan'}
        asset={selectedAsset.data}
        position={selectedAsset.position}
        onClose={handleClose}
      />
      <CollateralModal
        isOpen={selectedAsset.isOpen && selectedAsset.type === 'toggle-collateral'}
        asset={selectedAsset.data}
        position={selectedAsset.position}
        onClose={handleClose}
      />
    </>
  );
};

export { LendTables };
export type { LendTablesProps };

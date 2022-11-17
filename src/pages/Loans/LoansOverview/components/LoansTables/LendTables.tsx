import { LendPosition, LoanAsset, TickerToData } from '@interlay/interbtc-api';
import { Key, useState } from 'react';

import { Flex } from '@/component-library';

import { getPosition } from '../../utils/get-position';
import { CollateralModal } from '../CollateralModal';
import { LendAssetsTable } from '../LendAssetsTable/LendAssetsTable';
import { LendPositionsTable } from '../LendPositionsTable';
import { LoanModal } from '../LoanModal';

type UseAssetState = {
  type?: 'toggle-collateral' | 'change-loan';
  data?: LoanAsset;
  position?: LendPosition;
};

const defaultAssetState: UseAssetState = { type: undefined, data: undefined, position: undefined };

type LendTablesProps = {
  assets: TickerToData<LoanAsset>;
  positions: LendPosition[];
  disabledAssets: string[];
};

const LendTables = ({ assets, positions, disabledAssets }: LendTablesProps): JSX.Element => {
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
    <Flex direction='column' flex='1' gap='spacing12'>
      <LendPositionsTable
        assets={assets}
        positions={positions}
        onRowAction={handleRowAction}
        onPressCollateralSwitch={handlePressCollateralSwitch}
        disabledKeys={disabledAssets}
      />
      <LendAssetsTable
        assets={assets}
        positions={positions}
        onRowAction={handleRowAction}
        disabledKeys={disabledAssets}
      />
      <LoanModal
        variant='lend'
        open={selectedAsset.type === 'change-loan'}
        asset={selectedAsset.data}
        position={selectedAsset.position}
        onClose={handleClose}
      />
      <CollateralModal
        open={selectedAsset.type === 'toggle-collateral'}
        asset={selectedAsset.data}
        position={selectedAsset.position}
        onClose={handleClose}
      />
    </Flex>
  );
};

export { LendTables };
export type { LendTablesProps };

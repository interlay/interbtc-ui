import { LendPosition, LoanAsset, TickerToData } from '@interlay/interbtc-api';
import { Key, useState } from 'react';

import { Flex } from '@/component-library';

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
};

const LendTables = ({ assets, positions }: LendTablesProps): JSX.Element => {
  const [selectedAsset, setAsset] = useState<UseAssetState>(defaultAssetState);

  // TODO: subject to change in the future
  const handleAssetRowAction = (key: Key) => {
    const asset = assets[key as string];
    const position = positions.find((position) => position.currency === asset.currency);

    setAsset({ type: 'change-loan', data: asset, position });
  };

  // TODO: subject to change in the future
  const handlePositionRowAction = (key: Key) => {
    const position = positions[key as number];
    const asset = assets[position.currency.ticker];

    setAsset({ type: 'change-loan', data: asset, position });
  };

  const handlePressCollateralSwitch = (loanData: LoanAsset, position: LendPosition) => {
    setAsset({ type: 'toggle-collateral', data: loanData, position });
  };

  const handleClose = () => setAsset(defaultAssetState);

  return (
    <Flex direction='column' flex='1' gap='spacing12'>
      <LendPositionsTable
        assets={assets}
        positions={positions}
        onRowAction={handlePositionRowAction}
        onPressCollateralSwitch={handlePressCollateralSwitch}
      />
      <LendAssetsTable assets={assets} positions={positions} onRowAction={handleAssetRowAction} />
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

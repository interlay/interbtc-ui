import { BorrowPosition, LendPosition, LoanAsset, TickerToData } from '@interlay/interbtc-api';
import { useMemo } from 'react';

import { BorrowTables } from './BorrowTables';
import { LendTables } from './LendTables';
import { StyledTablesWrapper } from './LoansTables.style';

const getDisabledAssetsTicker = (assets: TickerToData<LoanAsset>) =>
  Object.values(assets)
    .filter((asset) => !asset.isActive)
    .map((activeAsset) => activeAsset.currency.ticker);

type LoansTablesProps = {
  lendPositions: LendPosition[];
  borrowPositions: BorrowPosition[];
  assets: TickerToData<LoanAsset>;
};

const LoansTables = ({ lendPositions, borrowPositions, assets }: LoansTablesProps): JSX.Element => {
  const disabledAssets = useMemo(() => getDisabledAssetsTicker(assets), [assets]);

  return (
    <StyledTablesWrapper gap='spacing6'>
      <LendTables assets={assets} positions={lendPositions} disabledAssets={disabledAssets} />
      <BorrowTables assets={assets} positions={borrowPositions} disabledAssets={disabledAssets} />
    </StyledTablesWrapper>
  );
};

export { LoansTables };
export type { LoansTablesProps };

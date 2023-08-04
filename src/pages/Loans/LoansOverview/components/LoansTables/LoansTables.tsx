import { TickerToData } from '@interlay/interbtc-api';
import { useMemo } from 'react';

import { BorrowPosition, CollateralPosition, LoanAsset } from '@/types/loans';

import { BorrowTables } from './BorrowTables';
import { LendTables } from './LendTables';
import { StyledTablesWrapper } from './LoansTables.style';

const getDisabledAssetsTicker = (assets: TickerToData<LoanAsset>) =>
  Object.values(assets)
    .filter((asset) => !asset.isActive)
    .map((activeAsset) => activeAsset.currency.ticker);

type LoansTablesProps = {
  lendPositions: CollateralPosition[];
  borrowPositions: BorrowPosition[];
  assets: TickerToData<LoanAsset>;
};

const LoansTables = ({ lendPositions, borrowPositions, assets }: LoansTablesProps): JSX.Element => {
  const disabledAssets = useMemo(() => getDisabledAssetsTicker(assets), [assets]);

  const hasBorrowPositions = !!borrowPositions.length;
  const hasLendPositions = !!lendPositions.length;
  const hasPositions = hasBorrowPositions || hasLendPositions;

  return (
    <StyledTablesWrapper $hasPositions={hasPositions}>
      <LendTables
        assets={assets}
        positions={lendPositions}
        disabledAssets={disabledAssets}
        hasPositions={hasPositions}
      />
      <BorrowTables
        assets={assets}
        positions={borrowPositions}
        disabledAssets={disabledAssets}
        hasPositions={hasPositions}
      />
    </StyledTablesWrapper>
  );
};

export { LoansTables };
export type { LoansTablesProps };

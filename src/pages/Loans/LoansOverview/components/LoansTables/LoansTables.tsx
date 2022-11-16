import { BorrowPosition, LendPosition, LoanAsset, TickerToData } from '@interlay/interbtc-api';

import { BorrowTables } from './BorrowTables';
import { LendTables } from './LendTables';
import { StyledTablesWrapper } from './LoansTables.style';

type LoansTablesProps = {
  lendPositions: LendPosition[];
  borrowPositions: BorrowPosition[];
  assets: TickerToData<LoanAsset>;
};

const LoansTables = ({ lendPositions, borrowPositions, assets }: LoansTablesProps): JSX.Element => {
  const disabledAssets = Object.values(assets).reduce(
    (keys: string[], asset) => (asset.isActive ? keys : [...keys, asset.currency.ticker]),
    []
  );

  return (
    <StyledTablesWrapper gap='spacing6'>
      <LendTables assets={assets} positions={lendPositions} disabledAssets={disabledAssets} />
      <BorrowTables assets={assets} positions={borrowPositions} disabledAssets={disabledAssets} />
    </StyledTablesWrapper>
  );
};

export { LoansTables };
export type { LoansTablesProps };

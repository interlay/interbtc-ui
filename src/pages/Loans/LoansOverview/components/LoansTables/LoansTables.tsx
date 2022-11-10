import { BorrowPosition, LendPosition, LoanAsset, TickerToData } from '@interlay/interbtc-api';

import { BorrowTables } from './BorrowTables';
import { LendTables } from './LendTables';
import { StyledTablesWrapper } from './LoansTables.style';

type LoansTablesProps = {
  lendPositions: LendPosition[];
  borrowPositions: BorrowPosition[];
  assets: TickerToData<LoanAsset>;
};

const LoansTables = ({ lendPositions, borrowPositions, assets }: LoansTablesProps): JSX.Element => (
  <StyledTablesWrapper gap='spacing6'>
    <LendTables assets={assets} positions={lendPositions} />
    <BorrowTables assets={assets} positions={borrowPositions} />
  </StyledTablesWrapper>
);

export { LoansTables };
export type { LoansTablesProps };

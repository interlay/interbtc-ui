import { BorrowPosition, LendPosition, LoanAsset, TickerToData } from '@interlay/interbtc-api';

import { BorrowMarket } from './BorrowMarket';
import { LendMarket } from './LendMarket';
import { StyledTablesWrapper } from './LoansMarkets.style';

type LoansMarketsProps = {
  lendPositions: LendPosition[];
  borrowPositions: BorrowPosition[];
  assets: TickerToData<LoanAsset>;
};

const LoansMarkets = ({ lendPositions, borrowPositions, assets }: LoansMarketsProps): JSX.Element => (
  <StyledTablesWrapper>
    <LendMarket assets={assets} positions={lendPositions} />
    <BorrowMarket assets={assets} positions={borrowPositions} />
  </StyledTablesWrapper>
);

export { LoansMarkets };
export type { LoansMarketsProps };

import { BorrowData, LendData } from '@/utils/hooks/api/loans/use-get-loans-data';

import { BorrowMarket } from './BorrowMarket';
import { LendMarket } from './LendMarket';
import { StyledTablesWrapper } from './LoansMarkets.style';

type LoansMarketsProps = {
  lend: LendData;
  borrow: BorrowData;
};

const LoansMarkets = ({ lend, borrow }: LoansMarketsProps): JSX.Element => (
  <StyledTablesWrapper>
    <LendMarket assets={lend.assets} positions={lend.positions} />
    <BorrowMarket assets={borrow.assets} positions={borrow.positions} />
  </StyledTablesWrapper>
);

export { LoansMarkets };
export type { LoansMarketsProps };

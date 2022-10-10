import { BorrowData, SupplyData } from '@/utils/hooks/api/loans/use-get-loans-data';

import { BorrowMarket } from './BorrowMarket';
import { StyledTablesWrapper } from './LoansMarkets.style';
import { SupplyMarket } from './SupplyMarket';

type LoansMarketsProps = {
  supply: SupplyData;
  borrow: BorrowData;
};

const LoansMarkets = ({ supply, borrow }: LoansMarketsProps): JSX.Element => (
  <StyledTablesWrapper>
    <SupplyMarket assets={supply.assets} positions={supply.positions} />
    <BorrowMarket assets={borrow.assets} positions={borrow.positions} />
  </StyledTablesWrapper>
);

export { LoansMarkets };
export type { LoansMarketsProps };

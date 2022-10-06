import { SupplyAssetData, SupplyData } from '@/utils/hooks/api/loans/use-get-loans-data';

import { StyledTablesWrapper } from './LoansMarkets.style';
import { SupplyMarket } from './SupplyMarket';

type LoansMarketsProps = {
  supply: SupplyData;
  // TODO: implement
  borrow: SupplyAssetData[];
};

const LoansMarkets = ({ supply }: LoansMarketsProps): JSX.Element => (
  <StyledTablesWrapper>
    <SupplyMarket assets={supply.assets} positions={supply.positions} />
    <SupplyMarket assets={supply.assets} positions={supply.positions} />
  </StyledTablesWrapper>
);

export { LoansMarkets };
export type { LoansMarketsProps };

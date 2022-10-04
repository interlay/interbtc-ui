import { SupplyAssetData } from '@/utils/hooks/api/loans/use-get-loans-data';

import { StyledTablesWrapper } from './LoansMarkets.style';
import { SupplyTable } from './SupplyTable';

type LoansMarketsProps = {
  supply: SupplyAssetData[];
  // TODO: implement
  borrow: SupplyAssetData[];
};

const LoansMarkets = ({ supply, borrow }: LoansMarketsProps): JSX.Element => {
  return (
    <StyledTablesWrapper>
      <SupplyTable data={supply} />
      <SupplyTable data={borrow} />
    </StyledTablesWrapper>
  );
};

export { LoansMarkets };
export type { LoansMarketsProps };

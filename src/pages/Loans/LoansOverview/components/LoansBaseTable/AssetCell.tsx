import { CoinIcon } from '@/component-library';

import { StyledAssetCellWrapper, StyledCellLabel } from './LoansBaseTable.style';

type AssetCellProps = {
  currency: string;
  hasPadding?: boolean;
};

const AssetCell = ({ currency, hasPadding }: AssetCellProps): JSX.Element => (
  <StyledAssetCellWrapper $hasPadding={hasPadding} gap='spacing2' alignItems='center'>
    <CoinIcon ticker={currency} />
    <StyledCellLabel>{currency}</StyledCellLabel>
  </StyledAssetCellWrapper>
);

export { AssetCell };
export type { AssetCellProps };

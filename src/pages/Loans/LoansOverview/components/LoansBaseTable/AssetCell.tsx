import { CoinIcon, Flex, Tokens } from '@/component-library';

import { StyledCellLabel } from './LoansBaseTable.style';

type AssetCellProps = {
  currency: string;
};

const AssetCell = ({ currency }: AssetCellProps): JSX.Element => (
  <Flex gap='spacing2' alignItems='center'>
    {/* TODO: Get rid of type casting - accept any string as currency ticker in CoinIcon component. */}
    <CoinIcon coin={currency as Tokens} size='small' />
    <StyledCellLabel>{currency}</StyledCellLabel>
  </Flex>
);

export { AssetCell };
export type { AssetCellProps };

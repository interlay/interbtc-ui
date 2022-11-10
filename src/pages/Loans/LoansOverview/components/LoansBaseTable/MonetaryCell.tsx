import { AlignItems, Colors, Flex } from '@/component-library';

import { StyledCellLabel, StyledCellSubLabel, StyledCellTickerLabel } from './LoansBaseTable.style';

type MonetaryCellProps = {
  label?: string;
  labelCurrency?: string;
  sublabel?: string;
  labelColor?: Colors;
  alignItems?: AlignItems;
};

const MonetaryCell = ({ label, sublabel, labelColor, labelCurrency, alignItems }: MonetaryCellProps): JSX.Element => (
  <Flex direction='column' alignItems={alignItems}>
    <StyledCellLabel color={labelColor}>
      {label}
      {labelCurrency && <StyledCellTickerLabel color={labelColor}>{labelCurrency}</StyledCellTickerLabel>}
    </StyledCellLabel>
    {sublabel && <StyledCellSubLabel>{sublabel}</StyledCellSubLabel>}
  </Flex>
);

export { MonetaryCell };
export type { MonetaryCellProps };

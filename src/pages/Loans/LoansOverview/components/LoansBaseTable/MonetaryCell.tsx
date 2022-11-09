import { Colors, Flex } from '@/component-library';

import { StyledCellLabel, StyledCellSubLabel, StyledCellTickerLabel } from './LoansBaseTable.style';

type MonetaryCellProps = {
  label?: string;
  labelCurrency?: string;
  sublabel?: string;
  labelColor?: Colors;
};

const MonetaryCell = ({ label, sublabel, labelColor, labelCurrency }: MonetaryCellProps): JSX.Element => (
  <Flex direction='column'>
    <StyledCellLabel color={labelColor}>
      {label}
      {labelCurrency && <StyledCellTickerLabel color={labelColor}>{labelCurrency}</StyledCellTickerLabel>}
    </StyledCellLabel>
    {sublabel && <StyledCellSubLabel>{sublabel}</StyledCellSubLabel>}
  </Flex>
);

export { MonetaryCell };
export type { MonetaryCellProps };

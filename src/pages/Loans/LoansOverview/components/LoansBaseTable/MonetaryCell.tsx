import { AlignItems, Colors, Flex } from '@/component-library';

import { StyledCellLabel, StyledCellSubLabel } from './LoansBaseTable.style';

type MonetaryCellProps = {
  label?: string;
  sublabel?: string;
  labelColor?: Colors;
  alignItems?: AlignItems;
};

const MonetaryCell = ({ label, sublabel, labelColor, alignItems }: MonetaryCellProps): JSX.Element => (
  <Flex direction='column' alignItems={alignItems}>
    <StyledCellLabel color={labelColor}>{label}</StyledCellLabel>
    {sublabel && <StyledCellSubLabel>{sublabel}</StyledCellSubLabel>}
  </Flex>
);

export { MonetaryCell };
export type { MonetaryCellProps };

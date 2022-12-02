import { forwardRef } from 'react';

import { AlignItems, Colors, Flex, FlexProps } from '@/component-library';

import { StyledCellLabel, StyledCellSubLabel } from './LoansBaseTable.style';

type Props = {
  label?: string;
  sublabel?: string;
  labelColor?: Colors;
  alignItems?: AlignItems;
};

type InheritAttrs = Omit<FlexProps, keyof Props>;

type MonetaryCellProps = Props & InheritAttrs;

const MonetaryCell = forwardRef<HTMLDivElement, MonetaryCellProps>(
  ({ label, sublabel, labelColor, alignItems, ...props }, ref): JSX.Element => (
    <Flex direction='column' alignItems={alignItems} ref={ref} {...props}>
      <StyledCellLabel color={labelColor}>{label}</StyledCellLabel>
      {sublabel && <StyledCellSubLabel>{sublabel}</StyledCellSubLabel>}
    </Flex>
  )
);

MonetaryCell.displayName = 'MonetaryCell';

export { MonetaryCell };
export type { MonetaryCellProps };

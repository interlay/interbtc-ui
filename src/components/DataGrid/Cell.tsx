import { forwardRef } from 'react';

import { Colors, Flex, FlexProps } from '@/component-library';

import { StyledCellLabel, StyledCellSubLabel } from './DataGrid.style';

type Props = {
  label?: string;
  sublabel?: string;
  labelColor?: Colors;
};

type InheritAttrs = Omit<FlexProps, keyof Props>;

type CellProps = Props & InheritAttrs;

const Cell = forwardRef<HTMLDivElement, CellProps>(
  ({ label, sublabel, labelColor: labelColorProp, alignItems, ...props }, ref): JSX.Element => {
    const labelColor = labelColorProp || sublabel ? 'secondary' : undefined;

    return (
      <Flex direction='column' alignItems={alignItems} ref={ref} {...props}>
        <StyledCellLabel color={labelColor}>{label}</StyledCellLabel>
        {sublabel && <StyledCellSubLabel>{sublabel}</StyledCellSubLabel>}
      </Flex>
    );
  }
);

Cell.displayName = 'Cell';

export { Cell };
export type { CellProps };

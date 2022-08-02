import { useTableCell } from '@react-aria/table';
import { mergeProps } from '@react-aria/utils';
import { TableState } from '@react-stately/table';
import { GridNode } from '@react-types/grid';
import { HTMLAttributes, useRef } from 'react';

import { StyledTableCell } from './Table.style';

type Props = {
  state: TableState<Record<string, any>>;
  cell: GridNode<Record<string, any>>;
};

type NativeAttrs = Omit<HTMLAttributes<HTMLTableCellElement>, keyof Props>;

type TableCellProps = Props & NativeAttrs;

const TableCell = ({ cell, state, ...props }: TableCellProps): JSX.Element => {
  const ref = useRef<HTMLTableCellElement>(null);
  const { gridCellProps } = useTableCell({ node: cell }, state, ref);

  return (
    <StyledTableCell ref={ref} {...mergeProps(props, gridCellProps)}>
      {cell.rendered}
    </StyledTableCell>
  );
};

export { TableCell };
export type { TableCellProps };

import { useFocusRing } from '@react-aria/focus';
import { useTableColumnHeader } from '@react-aria/table';
import { mergeProps } from '@react-aria/utils';
import { TableState } from '@react-stately/table';
import { GridNode } from '@react-types/grid';
import { HTMLAttributes, useRef } from 'react';

import { StyledTableColumnHeader } from './Table.style';

type Props = {
  state: TableState<Record<string, any>>;
  column: GridNode<Record<string, any>>;
};

type NativeAttrs = Omit<HTMLAttributes<HTMLTableCellElement>, keyof Props>;

type TableColumnHeaderProps = Props & NativeAttrs;

// TODO: add here arrow for sorting
const TableColumnHeader = ({ column, state, ...props }: TableColumnHeaderProps): JSX.Element => {
  const ref = useRef<HTMLTableCellElement>(null);
  const { columnHeaderProps } = useTableColumnHeader({ node: column }, state, ref);
  const {
    // isFocusVisible,
    focusProps
  } = useFocusRing();

  return (
    <StyledTableColumnHeader colSpan={column.colspan} ref={ref} {...mergeProps(props, columnHeaderProps, focusProps)}>
      {column.rendered}
    </StyledTableColumnHeader>
  );
};

export { TableColumnHeader };
export type { TableColumnHeaderProps };

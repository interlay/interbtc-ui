import { useTable } from '@react-aria/table';
import { TableStateProps, useTableState } from '@react-stately/table';
import { HTMLAttributes, useRef } from 'react';

import { StyledTable } from './Table.style';
import { TableCell } from './TableCell';
import { TableColumnHeader } from './TableColumnHeader';
import { TableHeaderRow } from './TableHeaderRow';
import { TableRow } from './TableRow';
import { TableRowGroup } from './TableRowGroup';

type InheritAttrs = TableStateProps<Record<string, any>>;

type NativeAttrs = Omit<HTMLAttributes<HTMLTableElement>, keyof InheritAttrs>;

type TableProps = InheritAttrs & NativeAttrs;

// TODO: add selection with and without checkbox
// TODO: add sorting
const Table = (props: TableProps): JSX.Element => {
  const state = useTableState(props);

  const ref = useRef<HTMLTableElement>(null);
  const { collection } = state;
  const { gridProps } = useTable(props, state, ref);

  return (
    <StyledTable {...gridProps} ref={ref}>
      <TableRowGroup as='thead'>
        {collection.headerRows.map((headerRow) => (
          <TableHeaderRow key={headerRow.key} item={headerRow} state={state}>
            {[...headerRow.childNodes].map((column) => (
              <TableColumnHeader key={column.key} column={column} state={state} />
            ))}
          </TableHeaderRow>
        ))}
      </TableRowGroup>
      <TableRowGroup as='tbody'>
        {[...collection.body.childNodes].map((row) => (
          <TableRow key={row.key} item={row} state={state}>
            {[...row.childNodes].map((cell) => (
              <TableCell key={cell.key} cell={cell} state={state} />
            ))}
          </TableRow>
        ))}
      </TableRowGroup>
    </StyledTable>
  );
};

export { Table };
export type { TableProps };

import { AriaTableProps, useTable } from '@react-aria/table';
import { mergeProps } from '@react-aria/utils';
import { TableStateProps, useTableState } from '@react-stately/table';
import { forwardRef, HTMLAttributes } from 'react';

import { useDOMRef } from '../utils/dom';
import { StyledTable } from './Table.style';
import { TableCell } from './TableCell';
import { TableColumnHeader } from './TableColumnHeader';
import { TableHeaderRow } from './TableHeaderRow';
import { TableRow } from './TableRow';
import { TableRowGroup } from './TableRowGroup';

type InheritAttrs = TableStateProps<Record<string, any>> & AriaTableProps<Record<string, any>>;

type NativeAttrs = Omit<HTMLAttributes<HTMLTableElement>, keyof InheritAttrs>;

type BaseTableProps = InheritAttrs & NativeAttrs;

const BaseTable = forwardRef<HTMLTableElement, BaseTableProps>(
  (props, ref): JSX.Element => {
    const state = useTableState(props);
    const tableRef = useDOMRef(ref);
    const { gridProps } = useTable(props, state, tableRef);

    const { collection } = state;

    return (
      <StyledTable ref={tableRef} {...mergeProps(props, gridProps)}>
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
  }
);

BaseTable.displayName = 'BaseTable';

export { BaseTable };
export type { BaseTableProps };

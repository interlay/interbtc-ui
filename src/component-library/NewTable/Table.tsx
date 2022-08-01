import { useTable } from '@react-aria/table';
import { useTableState } from '@react-stately/table';
import { useRef } from 'react';

import { TableCell } from './TableCell';
import { TableColumnHeader } from './TableColumnHeader';
import { TableHeaderRow } from './TableHeaderRow';
import { TableRow } from './TableRow';
import { TableRowGroup } from './TableRowGroup';

// TODO: add TableCheckboxCell (Checkbox)
const Table = (props: any): JSX.Element => {
  const { selectionMode, selectionBehavior } = props;
  const state = useTableState({
    ...props,
    showSelectionCheckboxes: selectionMode === 'multiple' && selectionBehavior !== 'replace'
  });

  const ref = useRef<HTMLTableElement>(null);
  const { collection } = state;
  const { gridProps } = useTable(props, state, ref);

  return (
    <table {...gridProps} ref={ref} style={{ borderCollapse: 'collapse' }}>
      <TableRowGroup
        type='thead'
        style={{
          borderBottom: '2px solid var(--spectrum-global-color-gray-800)'
        }}
      >
        {collection.headerRows.map((headerRow) => (
          <TableHeaderRow key={headerRow.key} item={headerRow} state={state}>
            {[...headerRow.childNodes].map(
              (column) => (
                // column.props.isSelectionCell ? (
                //   <TableSelectAllCell key={column.key} column={column} state={state} />
                // ) : (
                <TableColumnHeader key={column.key} column={column} state={state} />
              )
              // )
            )}
          </TableHeaderRow>
        ))}
      </TableRowGroup>
      <TableRowGroup type='tbody'>
        {[...collection.body.childNodes].map((row) => (
          <TableRow key={row.key} item={row} state={state}>
            {[...row.childNodes].map(
              (cell) => (
                // cell.props.isSelectionCell ? (
                //   <TableCheckboxCell key={cell.key} cell={cell} state={state} />
                // ) : (
                <TableCell key={cell.key} cell={cell} state={state} />
              )
              // )
            )}
          </TableRow>
        ))}
      </TableRowGroup>
    </table>
  );
};

export { Table };

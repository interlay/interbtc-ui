import { ReactNode } from 'react';

import { StyledTable, TableWrapper, TableRow, TableHeader, TableCell } from './Table.style';

type Cell = ReactNode;
type Row = Cell[];

interface TableProps {
  columnLabels: string[];
  rows: Row[];
}

const Table = ({ columnLabels, rows }: TableProps): JSX.Element => {
  return (
    <TableWrapper>
      <StyledTable>
        <thead>
          <TableRow>
            {columnLabels.map((columnLabel) => (
              <TableHeader key={columnLabel}>{columnLabel}</TableHeader>
            ))}
          </TableRow>
        </thead>
        <tbody>
          {rows.map((row, rowIndex: number) => (
            <TableRow key={`row-${rowIndex}`}>
              {row.map((cell, cellIndex) => (
                <TableCell key={`row-${rowIndex}-cell${cellIndex}`}>{cell}</TableCell>
              ))}
            </TableRow>
          ))}
        </tbody>
      </StyledTable>
    </TableWrapper>
  );
};

export { Table };
export type { TableProps };

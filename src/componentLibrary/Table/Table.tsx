import { ReactNode } from 'react';
import { TableWrapper, TableHead, TableRow, TableHeader, TableBody, TableCell } from './Table.style';

interface TableProps {
  columnLabels: string[];
  rows: ReactNode[][];
}

const Table = ({ columnLabels, rows }: TableProps): JSX.Element => {
  return (
    <TableWrapper>
      <TableHead>
        <TableRow>
          {columnLabels.map((columnLabel) => (
            <TableHeader key={columnLabel}>{columnLabel}</TableHeader>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row, rowIndex: number) => (
          <TableRow key={`row-${rowIndex}`}>
            {row.map((cell, cellIndex) => (
              <TableCell key={`row-${rowIndex}-cell${cellIndex}`}>{cell}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </TableWrapper>
  );
};

export { Table };
export type { TableProps };

import { Cell, Column, Row, TableBody, TableHeader } from '@react-stately/table';
import { forwardRef, ReactNode } from 'react';

import { BaseTable, BaseTableProps } from './BaseTable';

type Props = {
  columns: Array<{ name: ReactNode; uid: string }>;
  rows: Array<Record<string, any>>;
};

type InheritAttrs = Omit<BaseTableProps, keyof Props | 'children'>;

type TableProps = Props & InheritAttrs;

const Table = forwardRef<HTMLTableElement, TableProps>(
  ({ columns, rows, ...props }, ref): JSX.Element => (
    <BaseTable ref={ref} {...props}>
      <TableHeader columns={columns}>{(column) => <Column key={column.uid}>{column.name}</Column>}</TableHeader>
      <TableBody items={rows}>{(item: any) => <Row>{(columnKey) => <Cell>{item[columnKey]}</Cell>}</Row>}</TableBody>
    </BaseTable>
  )
);

Table.displayName = 'Table';

export { Table };
export type { TableProps };

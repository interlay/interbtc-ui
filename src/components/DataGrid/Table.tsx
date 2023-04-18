import { ReactNode } from 'react';

import { Card, Table as LiTable, TableProps as LibTableProps } from '@/component-library';

import { TableWrapper } from './TableWrapper';

type Props = {
  title?: ReactNode;
  titleId?: string;
  className?: string;
  actions?: ReactNode;
  placeholder?: ReactNode;
};

type InheritAttrs = Omit<LibTableProps, keyof Props>;

type TableProps = Props & InheritAttrs;

const Table = ({
  title,
  titleId,
  rows,
  columns,
  className,
  actions,
  placeholder,
  ...props
}: TableProps): JSX.Element => (
  <TableWrapper title={title} titleId={titleId} className={className} actions={actions}>
    <Card gap='spacing4' alignItems='center'>
      <LiTable {...props} rows={rows} columns={columns} aria-labelledby={titleId} />
      {!rows.length && placeholder}
    </Card>
  </TableWrapper>
);

export { Table };
export type { TableProps };

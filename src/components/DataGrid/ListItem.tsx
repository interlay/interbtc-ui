import { Fragment } from 'react';

import { Dd, Dl, DlGroup, DlProps, Dt, RowProps, TableProps } from '@/component-library';

type Props = {
  row: RowProps;
};

type TableAttrs = Omit<Pick<TableProps, 'columns'>, keyof Props>;

type InheritAttrs = Omit<DlProps, (keyof Props & TableAttrs) | 'children'>;

type ListItemProps = Props & TableAttrs & InheritAttrs;

const ListItem = ({ row, columns, ...props }: ListItemProps): JSX.Element => (
  <Dl {...props} direction='column' gap='spacing2' marginY='spacing4' marginX='spacing2'>
    {columns.map((column) => {
      const title = column.name;
      const children = row[column.uid];

      return title ? (
        <DlGroup key={column.uid} justifyContent='space-between' alignItems='baseline'>
          <Dt size='s'>{title}</Dt>
          <Dd>{children}</Dd>
        </DlGroup>
      ) : (
        <Fragment key={column.uid}>{children}</Fragment>
      );
    })}
  </Dl>
);
export { ListItem };
export type { ListItemProps };

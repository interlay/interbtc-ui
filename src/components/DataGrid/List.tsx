import { Fragment, ReactNode } from 'react';

import {
  Card,
  Dd,
  Dl,
  DlGroup,
  Dt,
  List as LibList,
  ListItem as LibListItem,
  ListProps as LibListProps,
  TableProps
} from '@/component-library';

import { TableWrapper } from './TableWrapper';

type Props = {
  title?: ReactNode;
  titleId?: string;
  className?: string;
  actions?: ReactNode;
  placeholder?: ReactNode;
};

type TableAttrs = Omit<Pick<TableProps, 'rows' | 'columns'>, keyof Props>;

type InheritAttrs = Omit<LibListProps, (keyof Props & TableAttrs) | 'children' | 'placeholder' | 'title'>;

type ListProps = Props & TableAttrs & InheritAttrs;

const List = ({ title, titleId, rows, columns, className, actions, placeholder, ...props }: ListProps): JSX.Element => (
  <TableWrapper title={title} titleId={titleId} className={className} actions={actions}>
    {rows.length ? (
      <LibList variant='card' aria-labelledby={titleId} {...props}>
        {rows.map((row) => (
          <LibListItem key={row.id} textValue={row.id.toString()} direction='column'>
            <Dl direction='column' gap='spacing2' marginY='spacing4' marginX='spacing2'>
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
          </LibListItem>
        ))}
      </LibList>
    ) : (
      <Card alignItems='center'>{placeholder}</Card>
    )}
  </TableWrapper>
);
export { List };
export type { ListProps };

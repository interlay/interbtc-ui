import { ReactNode } from 'react';

import {
  Card,
  List as LibList,
  ListItem as LibListItem,
  ListProps as LibListProps,
  TableProps
} from '@/component-library';

import { ListItem } from './ListItem';
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
            <ListItem row={row} columns={columns} />
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

import { useId } from '@react-aria/utils';
import { ReactNode } from 'react';

import { Card, Flex, H2, Table as LiTable, TableProps as LibTableProps } from '@/component-library';

type Props = {
  title?: ReactNode;
  className?: string;
  actions?: ReactNode;
  placeholder?: ReactNode;
};

type InheritAttrs = Omit<LibTableProps, keyof Props>;

type TableProps = Props & InheritAttrs;

const Table = ({ title, rows, columns, className, actions, placeholder, ...props }: TableProps): JSX.Element => {
  const titleId = useId();

  return (
    <Flex className={className} direction='column' gap='spacing6' alignItems='stretch'>
      <Flex gap='spacing2' justifyContent={title ? 'space-between' : 'flex-end'}>
        {title && (
          <H2 size='xl' weight='bold' id={titleId}>
            {title}
          </H2>
        )}
        {actions}
      </Flex>
      <Card gap='spacing4' alignItems='center'>
        <LiTable {...props} rows={rows} columns={columns} aria-labelledby={titleId} />
        {!rows.length && placeholder}
      </Card>
    </Flex>
  );
};

export { Table };
export type { TableProps };

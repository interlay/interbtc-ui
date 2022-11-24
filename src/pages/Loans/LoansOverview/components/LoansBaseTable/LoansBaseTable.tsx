import { useId } from '@react-aria/utils';

import { Card, Flex, P, Strong, Table, TableProps } from '@/component-library';

import { StyledTitle } from './LoansBaseTable.style';

type Props = {
  title: string;
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
};

type InheritAttrs = Omit<TableProps, keyof Props>;

type LoansBaseTableProps = Props & InheritAttrs;

const LoansBaseTable = ({
  title,
  rows,
  columns,
  emptyTitle,
  emptyDescription,
  className,
  ...props
}: LoansBaseTableProps): JSX.Element => {
  const titleId = useId();

  const hasRows = !!rows.length;

  return (
    <Flex className={className} direction='column' gap='spacing6' alignItems='stretch'>
      <StyledTitle id={titleId}>{title}</StyledTitle>
      {hasRows ? (
        <Card>
          <Table {...props} rows={rows} columns={columns} aria-labelledby={titleId} />
        </Card>
      ) : (
        <Card flex='1' justifyContent='center' alignItems='center'>
          <Flex direction='column' gap='spacing2' alignItems='center'>
            <Strong>{emptyTitle}</Strong>
            <P>{emptyDescription}</P>
          </Flex>
        </Card>
      )}
    </Flex>
  );
};

export { LoansBaseTable };
export type { LoansBaseTableProps };

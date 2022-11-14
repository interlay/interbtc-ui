import { useId } from '@react-aria/utils';

import { Card, Flex, Table, TableProps } from '@/component-library';

import { StyledTitle } from './LoansBaseTable.style';

type Props = {
  title: string;
};

type InheritAttrs = Omit<TableProps, keyof Props>;

type LoansBaseTableProps = Props & InheritAttrs;

const LoansBaseTable = ({ title, rows, columns, ...props }: LoansBaseTableProps): JSX.Element => {
  const titleId = useId();

  return (
    <Flex direction='column' gap='spacing6'>
      <StyledTitle id={titleId}>{title}</StyledTitle>
      <Card>
        <Table {...props} rows={rows} columns={columns} aria-labelledby={titleId} />
      </Card>
    </Flex>
  );
};

export { LoansBaseTable };
export type { LoansBaseTableProps };

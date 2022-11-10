import { useId } from '@react-aria/utils';

import { Card, Flex, Table, TableProps } from '@/component-library';

import { StyledMarketTitle } from './LoansBaseTable.style';

type Props = {
  title: string;
};

type InheritAttrs = Omit<TableProps, keyof Props>;

type LoansBaseTableProps = Props & InheritAttrs;

const LoansBaseTable = ({ title, rows, columns, ...props }: LoansBaseTableProps): JSX.Element => {
  const titleId = useId();

  return (
    <Flex direction='column' gap='spacing6'>
      <StyledMarketTitle id={titleId}>{title}</StyledMarketTitle>
      <Card>
        <Table {...props} rows={rows} columns={columns} aria-labelledby={titleId} />
      </Card>
    </Flex>
  );
};

export { LoansBaseTable };
export type { LoansBaseTableProps };

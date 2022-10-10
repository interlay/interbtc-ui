import { useId } from '@react-aria/utils';

import { Card, Stack, Table, TableProps } from '@/component-library';
import { Icon } from '@/component-library/Icon';

import { StyledMarketTitle } from './LoansMarkets.style';

const END_ADORNMENT = 'end-adornment';

type Props = {
  title: string;
};

type InheritAttrs = Omit<TableProps, keyof Props>;

type MarketTableProps = Props & InheritAttrs;

const MarketTable = ({ title, rows, columns, ...props }: MarketTableProps): JSX.Element => {
  const titleId = useId();

  const marketTableColumns = [...columns, { name: '', uid: END_ADORNMENT }];

  const marketTableRows = rows.map((row) => ({
    ...row,
    [END_ADORNMENT]: <Icon variant='chevron-right' width='1.5rem' height='1.5rem' />
  }));

  return (
    <Stack>
      <StyledMarketTitle id={titleId}>{title}</StyledMarketTitle>
      <Card>
        <Table {...props} rows={marketTableRows} columns={marketTableColumns} aria-labelledby={titleId} />
      </Card>
    </Stack>
  );
};

export { MarketTable };
export type { MarketTableProps };

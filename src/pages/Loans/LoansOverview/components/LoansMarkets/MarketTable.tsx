import { useId } from '@react-aria/utils';

import { Card, Stack, Table, TableProps } from '@/component-library';

import { StyledMarketTitle } from './LoansMarkets.style';

type Props = {
  title: string;
};

type InheritAttrs = Omit<TableProps, keyof Props>;

type MarketTableProps = Props & InheritAttrs;

const MarketTable = ({ title, ...props }: MarketTableProps): JSX.Element => {
  const titleId = useId();

  return (
    <Stack>
      <StyledMarketTitle id={titleId}>{title}</StyledMarketTitle>
      <Card>
        <Table {...props} aria-labelledby={titleId} />
      </Card>
    </Stack>
  );
};

export { MarketTable };
export type { MarketTableProps };

import { Table, TableProps } from '@/component-library';
import { IssueRequestWithStatusDecoded } from '@/types/issues';

import { Wrapper } from './ActionsTable.style';

interface Props {
  data: Array<IssueRequestWithStatusDecoded>;
  onClickVisitIssueRequest: (issueRequest: IssueRequestWithStatusDecoded) => void;
}

type InheritAttrs = Omit<TableProps, keyof Props | 'columns' | 'rows'>;

type ActionsTableProps = Props & InheritAttrs;

// ray test touch <
const columns = [
  { name: 'Coin', uid: 'coin' },
  { name: 'Price', uid: 'price' },
  { name: 'Mkt Cap', uid: 'market-cap' }
];

const rows = [
  { id: 1, coin: 'BTC', price: '$22,996.31', 'market-cap': '$439,503,832,639' },
  { id: 2, coin: 'DOT', price: '$8.13', 'market-cap': '$9,250,245,618' },
  { id: 3, coin: 'KINT', price: '$2.80', 'market-cap': '$2,397,911' },
  { id: 4, coin: 'kBTC', price: '$23,074.29', 'market-cap': '-' }
];
// ray test touch >

const ActionsTable = ({ data, onClickVisitIssueRequest, ...rest }: ActionsTableProps): JSX.Element => {
  // ray test touch <
  console.log('ray : ***** data => ', data);
  console.log('ray : ***** onClickVisitIssueRequest => ', onClickVisitIssueRequest);
  // ray test touch >

  return (
    <Wrapper variant='bordered'>
      {/* ray test touch < */}
      <Table columns={columns} rows={rows} {...rest} />
      {/* ray test touch > */}
    </Wrapper>
  );
};

export { ActionsTable };
export type { ActionsTableProps };

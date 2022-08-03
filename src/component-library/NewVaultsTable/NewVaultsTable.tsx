import { CoinPair } from '../CoinPair';
import { CTA } from '../CTA';
import { Table } from '../Table';
import { Tokens } from '../types';
import { CoinPairWrapper, NumericValue, Wrapper } from './NewVaultsTable.style';

interface NewVaultsTableRow {
  collateralCurrency: Tokens;
  wrappedCurrency: Tokens;
  minCollateralAmount: string;
  collateralRate: string;
  isActive: boolean;
  // TODO: Define ctaOnClick callback signature.
  ctaOnClick: () => void;
}

interface NewVaultsTableProps {
  data: NewVaultsTableRow[];
}

const NewVaultsTable = ({ data }: NewVaultsTableProps): JSX.Element => {
  const columnLabels = [
    { name: 'Vault Pair', uid: 'pair' },
    { name: 'Min Collateral', uid: 'min-collateral' },
    { name: 'Collateral Rate', uid: 'collateral-rate' }
  ];
  const rows = data.map((row, id) => ({
    id,
    pair: (
      <CoinPairWrapper key='coin_pair'>
        <CoinPair size='small' coinOne={row.collateralCurrency} coinTwo={row.wrappedCurrency} />{' '}
        {row.collateralCurrency} - {row.wrappedCurrency}
      </CoinPairWrapper>
    ),
    'min-collateral': (
      <NumericValue key='min_collateral'>
        {row.minCollateralAmount} {row.collateralCurrency}
      </NumericValue>
    ),
    'collateral-rate': (
      <CTA key='cta' variant='secondary' disabled={!row.isActive} fullWidth onClick={row.ctaOnClick}>
        {row.isActive ? 'Add' : 'Coming soon'}
      </CTA>
    )
  }));

  return (
    <Wrapper variant='bordered'>
      <Table columns={columnLabels} rows={rows} />
    </Wrapper>
  );
};

export { NewVaultsTable };
export type { NewVaultsTableProps, NewVaultsTableRow };

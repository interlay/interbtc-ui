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
}

interface NewVaultsTableProps {
  data: NewVaultsTableRow[];
  onClickAddVault: (data: NewVaultsTableRow) => void;
}

const columns = [
  { name: 'Vault Pair', uid: 'pair' },
  { name: 'Min Collateral', uid: 'min-collateral' },
  { name: 'Collateral Rate', uid: 'collateral-rate' },
  { name: '', uid: 'action' }
];

const NewVaultsTable = ({ data, onClickAddVault }: NewVaultsTableProps): JSX.Element => {
  const rows = data.map((row, id) => {
    const { collateralCurrency, collateralRate, isActive, minCollateralAmount, wrappedCurrency } = row;
    return {
      id,
      pair: (
        <CoinPairWrapper key='coin_pair'>
          <CoinPair size='small' coinOne={collateralCurrency} coinTwo={wrappedCurrency} /> {collateralCurrency} -{' '}
          {wrappedCurrency}
        </CoinPairWrapper>
      ),
      'min-collateral': (
        <NumericValue key='min_collateral'>
          {minCollateralAmount} {collateralCurrency}
        </NumericValue>
      ),
      'collateral-rate': <NumericValue key='collateral_rate'>{collateralRate}%</NumericValue>,
      action: (
        <CTA key='cta' variant='secondary' disabled={!isActive} fullWidth onClick={() => onClickAddVault(row)}>
          {isActive ? 'Add' : 'Coming soon'}
        </CTA>
      )
    };
  });

  return (
    <Wrapper variant='bordered'>
      <Table columns={columns} rows={rows} />
    </Wrapper>
  );
};

export { NewVaultsTable };
export type { NewVaultsTableProps, NewVaultsTableRow };

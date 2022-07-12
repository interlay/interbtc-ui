import { CTA, Table, CoinPair } from '..';
import { Tokens } from '../types';
import { CoinPairWrapper, NumericValue } from './NewVaultsTable.style';

interface NewVaultsTableRow {
  collateralCurrency: Tokens;
  wrappedCurrency: Tokens;
  minCollateralAmount: string;
  collateralRate: string;
  isActive: boolean;
  isInstalled: boolean;
  // TODO: Define ctaOnClick callback signature.
  ctaOnClick: () => void;
}

interface NewVaultsTableProps {
  data: NewVaultsTableRow[];
}

const renderRowCells = ({
  collateralCurrency,
  wrappedCurrency,
  minCollateralAmount,
  collateralRate,
  isActive,
  isInstalled,
  ctaOnClick
}: NewVaultsTableRow) => [
  <CoinPairWrapper key='coin_pair'>
    <CoinPair size='small' coinOne={collateralCurrency} coinTwo={wrappedCurrency} /> {collateralCurrency} -{' '}
    {wrappedCurrency}
  </CoinPairWrapper>,

  <NumericValue key='min_collateral'>
    {minCollateralAmount} {collateralCurrency}
  </NumericValue>,

  <NumericValue key='collateral_rate'>{collateralRate}%</NumericValue>,

  <CTA key='cta' variant='secondary' disabled={!isActive || !!isInstalled} fullWidth onClick={ctaOnClick}>
    {isActive && !isInstalled ? 'Add' : isInstalled ? 'Vault installed' : 'Coming soon'}
  </CTA>
];

const NewVaultsTable = ({ data }: NewVaultsTableProps): JSX.Element => {
  const columnLabels = ['Vault Pair', 'Min Collateral', 'Collateral Rate'];
  const rows = data.map(renderRowCells);

  return <Table columnLabels={columnLabels} rows={rows} />;
};

export { NewVaultsTable };
export type { NewVaultsTableProps, NewVaultsTableRow };

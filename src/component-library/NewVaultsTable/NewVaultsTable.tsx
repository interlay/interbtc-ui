import { CTA, Table, CoinPair } from 'component-library';
import { CurrencySymbols } from 'types/currency';
import { CoinPairWrapper, NumericValue } from './NewVaultsTable.style';

interface NewVaultsTableRow {
  collateralCurrency: CurrencySymbols;
  wrappedCurrency: CurrencySymbols;
  apy: string;
  minCollateralAmount: string;
  collateralRate: string;
  isActive: boolean;
  // TODO: Define ctaOnClick callback signature.
  ctaOnClick: () => void;
}

interface NewVaultsTableProps {
  data: NewVaultsTableRow[];
}

const renderRowCells = ({
  collateralCurrency,
  wrappedCurrency,
  apy,
  minCollateralAmount,
  collateralRate,
  isActive,
  ctaOnClick
}: NewVaultsTableRow) => [
  <CoinPairWrapper key='coin_pair'>
    <CoinPair size='small' coinOne={collateralCurrency} coinTwo={wrappedCurrency} /> {collateralCurrency} -{' '}
    {wrappedCurrency}
  </CoinPairWrapper>,

  <NumericValue key='apy' highlight>
    {apy}%
  </NumericValue>,

  <NumericValue key='min_collateral'>
    {minCollateralAmount} {collateralCurrency}
  </NumericValue>,

  <NumericValue key='collateral_rate'>{collateralRate}%</NumericValue>,

  <CTA key='cta' variant='secondary' disabled={!isActive} fullWidth onClick={ctaOnClick}>
    {isActive ? 'Add' : 'Coming soon'}
  </CTA>
];

const NewVaultsTable = ({ data }: NewVaultsTableProps): JSX.Element => {
  const columnLabels = ['Vault Pair', 'Estimated APY', 'Min Collateral', 'Collateral Rate'];
  const rows = data.map(renderRowCells);

  return <Table columnLabels={columnLabels} rows={rows} />;
};

export { NewVaultsTable };
export type { NewVaultsTableProps, NewVaultsTableRow };

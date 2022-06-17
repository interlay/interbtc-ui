import { Table } from 'componentLibrary';
import { useTranslation } from 'react-i18next';
import { CurrencySymbols } from '../../types/currency';
import { CoinPair } from '../CoinPair';
import { AddVaultButton, CoinPairWrapper, NumericValue } from './NewVaultsTable.style';

interface NewVaultsTableRow {
  collateralCurrency: CurrencySymbols;
  wrappedCurrency: CurrencySymbols;
  apy: string;
  minCollateralAmount: string;
  collateralRate: string;
  isActive: boolean;
}
interface NewVaultsTableProps {
  data: NewVaultsTableRow[];
}

const NewVaultsTable = ({ data }: NewVaultsTableProps): JSX.Element => {
  const { t } = useTranslation();

  const renderRowCells = ({
    collateralCurrency,
    wrappedCurrency,
    apy,
    minCollateralAmount,
    collateralRate,
    isActive
  }: NewVaultsTableRow) => [
    <CoinPairWrapper key={`${collateralCurrency}-${wrappedCurrency}-coin_pair`}>
      <CoinPair size='small' coinOne={collateralCurrency} coinTwo={wrappedCurrency} /> {collateralCurrency} -{' '}
      {wrappedCurrency}
    </CoinPairWrapper>,
    <NumericValue key={`${collateralCurrency}-${wrappedCurrency}-apy`} variant='primary'>
      {apy} %
    </NumericValue>,
    <NumericValue key={`${collateralCurrency}-${wrappedCurrency}-min_collateral`} variant='secondary'>
      {minCollateralAmount}
    </NumericValue>,
    <NumericValue key={`${collateralCurrency}-${wrappedCurrency}-collateral_rate`} variant='secondary'>
      {collateralRate} %
    </NumericValue>,
    <AddVaultButton key={`${collateralCurrency}-${wrappedCurrency}-button`} as='button' disabled={!isActive}>
      {isActive ? t('add') : t('coming_soon')}
    </AddVaultButton>
  ];

  const columnLabels = ['Vault Pair', 'Estimated APY', 'Min Collateral', 'Collateral Rate'];
  const rows = data.map(renderRowCells);

  return <Table columnLabels={columnLabels} rows={rows} />;
};

export { NewVaultsTable };
export type { NewVaultsTableProps };

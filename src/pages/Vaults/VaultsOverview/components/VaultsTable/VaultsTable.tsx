import { CollateralIdLiteral, CurrencyIdLiteral } from '@interlay/interbtc-api';

import { CoinPair, CTA, Table, TableProps } from '@/component-library';

import { CoinPairWrapper, NumericValue, Wrapper } from './VaultsTable.style';

const columns = [
  { name: 'Vault Pair', uid: 'pair' },
  { name: 'Min Collateral', uid: 'min-collateral' },
  { name: 'Collateral Rate', uid: 'collateral-rate' },
  { name: '', uid: 'action' }
];

type VaultsTableRow = {
  collateralCurrency: CollateralIdLiteral;
  wrappedCurrency: CurrencyIdLiteral;
  minCollateralAmount: string;
  collateralRate: string;
  isActive: boolean;
};

type Props = {
  data: VaultsTableRow[];
  onClickAddVault: (data: VaultsTableRow) => void;
};

type InheritAttrs = Omit<TableProps, keyof Props | 'columns' | 'rows'>;

type VaultsTableProps = Props & InheritAttrs;

const VaultsTable = ({ data, onClickAddVault, className, style, ...props }: VaultsTableProps): JSX.Element => {
  const rows = data.map((row, id) => {
    const { collateralCurrency, collateralRate, isActive, isInstalled, minCollateralAmount, wrappedCurrency } = row;
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
      'collateral-rate': <NumericValue key='collateral_rate'>{collateralRate}‰</NumericValue>,
      action: (
        <CTA
          key='cta'
          variant='secondary'
          disabled={!isActive || !!isInstalled}
          fullWidth
          onClick={() => onClickAddVault(row)}
        >
          {isActive && !isInstalled ? 'Add' : isInstalled ? 'Vault installed' : 'Coming soon'}
        </CTA>
      )
    };
  });

  return (
    <Wrapper variant='bordered' className={className} style={style}>
      <Table columns={columns} rows={rows} {...props} />
    </Wrapper>
  );
};

export { VaultsTable };
export type { VaultsTableProps, VaultsTableRow };

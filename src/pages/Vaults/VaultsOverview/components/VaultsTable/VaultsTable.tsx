import { CurrencyExt, CurrencyIdLiteral } from '@interlay/interbtc-api';
import Big from 'big.js';
import { useTranslation } from 'react-i18next';

import { CoinPair, CTA, Table, TableProps } from '@/component-library';

import { CoinPairWrapper, NumericValue, Wrapper } from './VaultsTable.style';

enum VaultsTableKeys {
  COIN_PAIR = 'coin-pair',
  MIN_COLLATERAL = 'min-collateral',
  COLLATERAL_RATE = 'collateral-rate',
  ACTION = 'action'
}

type VaultsTableRow = {
  collateralCurrency: CurrencyExt;
  wrappedCurrency: CurrencyIdLiteral;
  minCollateralAmount: Big;
  collateralRate: string;
  isActive: boolean;
  isInstalled: boolean;
};

type Props = {
  data: VaultsTableRow[];
  onClickAddVault: (data: VaultsTableRow) => void;
};

type InheritAttrs = Omit<TableProps, keyof Props | 'columns' | 'rows'>;

type VaultsTableProps = Props & InheritAttrs;

const VaultsTable = ({ data, onClickAddVault, className, style, ...props }: VaultsTableProps): JSX.Element => {
  const { t } = useTranslation();

  const columns = [
    { name: t('vault.create_table.vault_pair'), uid: VaultsTableKeys.COIN_PAIR },
    { name: t('vault.create_table.min_collateral'), uid: VaultsTableKeys.MIN_COLLATERAL },
    { name: t('vault.create_table.collateral_rate'), uid: VaultsTableKeys.COLLATERAL_RATE },
    { name: '', uid: VaultsTableKeys.ACTION }
  ];

  const rows = data.map((row, id) => {
    const { collateralCurrency, collateralRate, isActive, isInstalled, minCollateralAmount, wrappedCurrency } = row;
    return {
      id,
      [VaultsTableKeys.COIN_PAIR]: (
        <CoinPairWrapper key={VaultsTableKeys.COIN_PAIR}>
          <CoinPair size='small' coinOne={collateralCurrency.ticker as CurrencyIdLiteral} coinTwo={wrappedCurrency} />{' '}
          {collateralCurrency.ticker} - {wrappedCurrency}
        </CoinPairWrapper>
      ),
      [VaultsTableKeys.MIN_COLLATERAL]: (
        <NumericValue key={VaultsTableKeys.MIN_COLLATERAL}>
          {minCollateralAmount.toNumber().toFixed(2)} {collateralCurrency.ticker}
        </NumericValue>
      ),
      [VaultsTableKeys.COLLATERAL_RATE]: (
        <NumericValue key={VaultsTableKeys.COLLATERAL_RATE}>{collateralRate}%</NumericValue>
      ),
      [VaultsTableKeys.ACTION]: (
        <CTA
          key='cta'
          variant='secondary'
          disabled={!isActive || !!isInstalled}
          fullWidth
          onClick={() => onClickAddVault(row)}
        >
          {isActive && !isInstalled
            ? t('vault.add')
            : isInstalled
            ? t('vault.vault_installed')
            : t('vault.coming_soon')}
        </CTA>
      )
    };
  });

  // ray test touch <
  return (
    <Wrapper variant='bordered' className={className} style={style}>
      <Table columns={columns} rows={rows} {...props} />
    </Wrapper>
  );
  // ray test touch >
};

export { VaultsTable };
export type { VaultsTableProps, VaultsTableRow };

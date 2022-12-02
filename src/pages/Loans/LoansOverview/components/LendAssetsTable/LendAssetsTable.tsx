import { LoanAsset, newMonetaryAmount, TickerToData } from '@interlay/interbtc-api';
import { Key, ReactNode, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { convertMonetaryAmountToValueInUSD, formatUSD } from '@/common/utils/utils';
import { useGetBalances } from '@/utils/hooks/api/tokens/use-get-balances';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';

import { ApyCell, AssetCell, BalanceCell, LoansBaseTableProps } from '../LoansBaseTable';
import { MonetaryCell } from '../LoansBaseTable/MonetaryCell';
import { StyledLendAssetsTable } from './LendAssetsTable.style';

enum LendAssetsColumns {
  ASSET = 'asset',
  APY = 'apy',
  WALLET = 'wallet',
  TOTAL_SUPPLY = 'totalSupply'
}

type LendAssetsTableRow = {
  id: string;
  [LendAssetsColumns.ASSET]: ReactNode;
  [LendAssetsColumns.APY]: ReactNode;
  [LendAssetsColumns.WALLET]: ReactNode;
  [LendAssetsColumns.TOTAL_SUPPLY]: ReactNode;
};

// TODO: translations
const lendAssetsColumns = [
  { name: 'Asset', uid: LendAssetsColumns.ASSET },
  { name: 'APY', uid: LendAssetsColumns.APY },
  { name: 'Wallet', uid: LendAssetsColumns.WALLET },
  { name: 'Total Supplied', uid: LendAssetsColumns.TOTAL_SUPPLY }
];

type LendAssetsTableProps = {
  assets: TickerToData<LoanAsset>;
  onRowAction: LoansBaseTableProps['onRowAction'];
  disabledKeys: LoansBaseTableProps['disabledKeys'];
};

const LendAssetsTable = ({ assets, onRowAction, disabledKeys }: LendAssetsTableProps): JSX.Element => {
  const { t } = useTranslation();
  const prices = useGetPrices();
  const { data: balances } = useGetBalances();

  const rows: LendAssetsTableRow[] = useMemo(
    () =>
      Object.values(assets).map(({ lendApy, lendReward, currency, totalLiquidity }) => {
        const asset = <AssetCell currency={currency.ticker} />;

        const apy = (
          <ApyCell
            apy={lendApy}
            currency={currency}
            rewards={lendReward}
            prices={prices}
            // TODO: temporary until we find why row click is being ignored
            onClick={() => onRowAction?.(currency.ticker as Key)}
          />
        );

        const amount = balances ? balances[currency.ticker].free : newMonetaryAmount(0, currency);
        const wallet = <BalanceCell amount={amount} prices={prices} />;

        const liquidityUSDValue = convertMonetaryAmountToValueInUSD(
          totalLiquidity,
          prices?.[totalLiquidity.currency.ticker].usd
        );
        const liquidityLabel = liquidityUSDValue || 0;
        const totalSupply = <MonetaryCell label={formatUSD(liquidityLabel, { compact: true })} alignItems='flex-end' />;

        return {
          id: currency.ticker,
          asset,
          apy,
          wallet,
          totalSupply
        };
      }),
    [assets, balances, onRowAction, prices]
  );

  return (
    <StyledLendAssetsTable
      title={t('loans.lend_markets')}
      onRowAction={onRowAction}
      rows={rows}
      columns={lendAssetsColumns}
      disabledKeys={disabledKeys}
    />
  );
};

export { LendAssetsTable };
export type { LendAssetsTableProps };

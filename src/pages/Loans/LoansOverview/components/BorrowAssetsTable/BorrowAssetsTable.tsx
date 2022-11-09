import { LoanAsset, LoanPosition, newMonetaryAmount, TickerToData } from '@interlay/interbtc-api';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { displayMonetaryAmountInUSDFormat } from '@/common/utils/utils';
import { useGetBalances } from '@/utils/hooks/api/tokens/use-get-balances';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';

import { ApyCell, AssetCell, BalanceCell, LoansBaseTable, LoansBaseTableProps } from '../LoansBaseTable';
import { BorrowAssetsColumns, BorrowAssetsTableRow } from '../types';

// TODO: translations
const borrowAssetsColumns = [
  { name: 'Asset', uid: BorrowAssetsColumns.ASSET },
  { name: 'APY', uid: BorrowAssetsColumns.APY },
  { name: 'Wallet', uid: BorrowAssetsColumns.WALLET },
  { name: 'Liquidity', uid: BorrowAssetsColumns.LIQUIDITY }
];

type BorrowAssetsTableProps = {
  assets: TickerToData<LoanAsset>;
  positions: LoanPosition[];
  onRowAction: LoansBaseTableProps['onRowAction'];
};

const BorrowAssetsTable = ({ assets, positions, onRowAction }: BorrowAssetsTableProps): JSX.Element => {
  const { t } = useTranslation();
  const prices = useGetPrices();
  const { data: balances } = useGetBalances();

  const availableAssets = useMemo(
    () =>
      Object.values(assets).filter(
        (asset) => !positions.find((position) => position.currency.ticker === asset.currency.ticker)
      ),
    [assets, positions]
  );

  const borrowAssetsTableRows: BorrowAssetsTableRow[] = useMemo(
    () =>
      availableAssets.map(({ borrowApy, currency, totalLiquidity }) => {
        const asset = <AssetCell currency={currency.ticker} />;

        const apy = <ApyCell apy={borrowApy} />;

        const amount = balances ? balances[currency.ticker].free : newMonetaryAmount(0, currency);
        const wallet = <BalanceCell amount={amount} prices={prices} />;

        return {
          id: currency.ticker,
          asset,
          apy,
          wallet,
          liquidity: displayMonetaryAmountInUSDFormat(totalLiquidity, prices?.[totalLiquidity.currency.ticker].usd)
        };
      }),
    [availableAssets, balances, prices]
  );

  return (
    <LoansBaseTable
      title={t('loans.borrow')}
      onRowAction={onRowAction}
      rows={borrowAssetsTableRows}
      columns={borrowAssetsColumns}
    />
  );
};

export { BorrowAssetsTable };
export type { BorrowAssetsTableProps };

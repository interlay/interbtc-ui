import { LoanAsset, newMonetaryAmount, TickerToData } from '@interlay/interbtc-api';
import { useId } from '@react-aria/utils';
import { Key, ReactNode, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { convertMonetaryAmountToValueInUSD, formatUSD } from '@/common/utils/utils';
import { AssetCell, BalanceCell, Cell, Table, TableProps } from '@/components';
import { LoanApyCell, LoanTablePlaceholder } from '@/components/LoanPositionsTable';
import { getTokenPrice } from '@/utils/helpers/prices';
import { useGetBalances } from '@/utils/hooks/api/tokens/use-get-balances';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';

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

type Props = {
  assets: TickerToData<LoanAsset>;
};

type InheritAttrs = Omit<TableProps, keyof Props | 'columns' | 'rows'>;

type LendAssetsTableProps = Props & InheritAttrs;

const LendAssetsTable = ({ assets, onRowAction, ...props }: LendAssetsTableProps): JSX.Element => {
  const titleId = useId();
  const { t } = useTranslation();
  const prices = useGetPrices();
  const { data: balances } = useGetBalances();

  const lendAssetsColumns = useMemo(
    () => [
      { name: t('asset'), uid: LendAssetsColumns.ASSET },
      { name: t('apy'), uid: LendAssetsColumns.APY },
      { name: t('wallet'), uid: LendAssetsColumns.WALLET },
      { name: t('loans.total_supplied'), uid: LendAssetsColumns.TOTAL_SUPPLY }
    ],
    [t]
  );

  const rows: LendAssetsTableRow[] = useMemo(
    () =>
      Object.values(assets).map(({ lendApy, currency, totalLiquidity, lendReward }) => {
        const asset = <AssetCell ticker={currency.ticker} />;

        const apy = (
          <LoanApyCell
            apy={lendApy}
            currency={currency}
            rewardsPerYear={lendReward}
            prices={prices}
            // TODO: temporary until we find why row click is being ignored
            onClick={() => onRowAction?.(currency.ticker as Key)}
          />
        );

        const amount = balances ? balances[currency.ticker].free : newMonetaryAmount(0, currency);
        const amountUSD = convertMonetaryAmountToValueInUSD(amount, getTokenPrice(prices, amount.currency.ticker)?.usd);
        const wallet = <BalanceCell amount={amount} amountUSD={amountUSD || 0} />;

        const liquidityUSDValue = convertMonetaryAmountToValueInUSD(
          totalLiquidity,
          getTokenPrice(prices, totalLiquidity.currency.ticker)?.usd
        );
        const liquidityLabel = liquidityUSDValue || 0;
        const totalSupply = <Cell label={formatUSD(liquidityLabel, { compact: true })} alignItems='flex-end' />;

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
    <Table
      {...props}
      title={t('loans.lend_markets')}
      titleId={titleId}
      rows={rows}
      columns={lendAssetsColumns}
      placeholder={<LoanTablePlaceholder variant='borrow' />}
      onRowAction={onRowAction}
    />
  );
};

export { LendAssetsTable };
export type { LendAssetsTableProps };

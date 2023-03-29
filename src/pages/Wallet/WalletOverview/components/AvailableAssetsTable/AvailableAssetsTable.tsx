import { ReactNode, useMemo, useState } from 'react';

import { convertMonetaryAmountToValueInUSD, formatUSD } from '@/common/utils/utils';
import { P, Switch, theme } from '@/component-library';
import { useMediaQuery } from '@/component-library/use-media-query';
import { Cell } from '@/components';
import { AssetCell, DataGrid } from '@/components/DataGrid';
import { getCoinIconProps } from '@/utils/helpers/coin-icon';
import { getTokenPrice } from '@/utils/helpers/prices';
import { BalanceData } from '@/utils/hooks/api/tokens/use-get-balances';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';

import { ActionsCell } from './ActionsCell';

enum AvailableAssetsColumns {
  ASSET = 'asset',
  PRICE = 'price',
  BALANCE = 'balance',
  ACTIONS = 'actions'
}

type AvailableAssetsRows = {
  id: string;
  [AvailableAssetsColumns.ASSET]: ReactNode;
  [AvailableAssetsColumns.PRICE]: ReactNode;
  [AvailableAssetsColumns.BALANCE]: ReactNode;
  [AvailableAssetsColumns.ACTIONS]: ReactNode;
};

type AvailableAssetsTableProps = {
  balances?: BalanceData;
  pooledTickers?: Set<string>;
};

const AvailableAssetsTable = ({ balances, pooledTickers }: AvailableAssetsTableProps): JSX.Element => {
  const [isOpen, setOpen] = useState(false);
  const prices = useGetPrices();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const rows: AvailableAssetsRows[] = useMemo(() => {
    const data = balances ? Object.values(balances) : [];
    const filteredData = isOpen ? data : data.filter((balance) => !balance.free.isZero());

    return filteredData.map(
      ({ currency, free }): AvailableAssetsRows => {
        const asset = (
          <AssetCell
            size={isMobile ? 'xl2' : undefined}
            textSize={isMobile ? 'base' : undefined}
            marginBottom={isMobile ? 'spacing4' : undefined}
            {...getCoinIconProps(currency)}
          />
        );

        const tokenPrice = getTokenPrice(prices, currency.ticker)?.usd || 0;

        const assetPriceLabel = formatUSD(getTokenPrice(prices, currency.ticker)?.usd || 0, { compact: true });
        const price = <Cell label={assetPriceLabel} />;

        const balanceLabel = free.toString();
        const balanceSublabel = formatUSD(convertMonetaryAmountToValueInUSD(free, tokenPrice) || 0, {
          compact: true
        });
        const balance = (
          <Cell alignItems={isMobile ? 'flex-end' : undefined} label={balanceLabel} sublabel={balanceSublabel} />
        );

        const actions = <ActionsCell pooledTickers={pooledTickers} currency={currency} />;

        return {
          id: currency.ticker,
          asset,
          price,
          balance,
          actions
        };
      }
    );
  }, [balances, isMobile, pooledTickers, isOpen, prices]);

  const actions = (
    <Switch isSelected={isOpen} onChange={(e) => setOpen(e.target.checked)}>
      Show Zero Balance
    </Switch>
  );

  const columns = [
    { name: isMobile ? '' : 'Asset', uid: AvailableAssetsColumns.ASSET },
    { name: 'Price', uid: AvailableAssetsColumns.PRICE },
    { name: 'Balance', uid: AvailableAssetsColumns.BALANCE },
    { name: '', uid: AvailableAssetsColumns.ACTIONS }
  ];

  return (
    <DataGrid
      actions={actions}
      title='Available assets'
      columns={columns}
      rows={rows}
      placeholder={<P weight='bold'>No Assets Available</P>}
    />
  );
};

export { AvailableAssetsTable };
export type { AvailableAssetsTableProps };

import { isCurrencyEqual } from '@interlay/interbtc-api';
import { ReactNode, useMemo, useState } from 'react';

import { convertMonetaryAmountToValueInUSD, formatUSD } from '@/common/utils/utils';
import { CTA, CTALink, Flex, P, Switch } from '@/component-library';
import { AssetCell, Cell, Table } from '@/components';
import { WRAPPED_TOKEN } from '@/config/relay-chains';
import { PAGES } from '@/utils/constants/links';
import { getCoinIconProps } from '@/utils/helpers/coin-icon';
import { getTokenPrice } from '@/utils/helpers/prices';
import { BalanceData } from '@/utils/hooks/api/tokens/use-get-balances';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';

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
};

const AvailableAssetsTable = ({ balances }: AvailableAssetsTableProps): JSX.Element => {
  const [isOpen, setOpen] = useState(false);
  const prices = useGetPrices();

  const columns = [
    { name: 'Asset', uid: AvailableAssetsColumns.ASSET },
    { name: 'Price', uid: AvailableAssetsColumns.PRICE },
    { name: 'Balance', uid: AvailableAssetsColumns.BALANCE },
    { name: '', uid: AvailableAssetsColumns.ACTIONS }
  ];

  const rows: AvailableAssetsRows[] = useMemo(() => {
    const data = balances ? Object.values(balances) : [];
    const filteredData = isOpen ? data : data.filter((balance) => !balance.free.isZero());

    return filteredData.map(
      ({ currency, free }): AvailableAssetsRows => {
        const asset = <AssetCell {...getCoinIconProps(currency)} />;

        const tokenPrice = getTokenPrice(prices, currency.ticker)?.usd || 0;

        const assetPriceLabel = formatUSD(getTokenPrice(prices, currency.ticker)?.usd || 0, { compact: true });
        const price = <Cell label={assetPriceLabel} />;

        const balanceLabel = free.toString();
        const balanceSublabel = formatUSD(convertMonetaryAmountToValueInUSD(free, tokenPrice) || 0, {
          compact: true
        });
        const balance = <Cell label={balanceLabel} sublabel={balanceSublabel} />;

        const actions = (
          <Flex justifyContent='flex-end' gap='spacing1'>
            {isCurrencyEqual(currency, WRAPPED_TOKEN) && (
              <CTALink to={{ pathname: PAGES.BRIDGE, search: 'tab=redeem' }} variant='outlined' size='small'>
                Redeem
              </CTALink>
            )}
            <CTALink to={PAGES.TRANSFER} variant='outlined' size='small'>
              Transfer
            </CTALink>
            <CTALink to={PAGES.SWAP} variant='outlined' size='small'>
              Swap
            </CTALink>
            {/* Missing the buy link */}
            <CTA variant='outlined' size='small'>
              Buy
            </CTA>
          </Flex>
        );

        return {
          id: currency.ticker,
          asset,
          price,
          balance,
          actions
        };
      }
    );
  }, [balances, isOpen, prices]);

  const actions = (
    <Switch isSelected={isOpen} onChange={(e) => setOpen(e.target.checked)}>
      Show Zero Balance
    </Switch>
  );

  return (
    <Table
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

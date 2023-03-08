import { ReactNode, useMemo, useState } from 'react';

import { convertMonetaryAmountToValueInUSD, formatUSD } from '@/common/utils/utils';
import { CTA, Flex, P, Switch } from '@/component-library';
import { AssetCell, Cell, Table } from '@/components';
import { GOVERNANCE_TOKEN, VOTE_GOVERNANCE_TOKEN } from '@/config/relay-chains';
import { getCoinIconProps } from '@/utils/helpers/coin-icon';
import { getTokenPrice } from '@/utils/helpers/prices';
import { BalanceData } from '@/utils/hooks/api/tokens/use-get-balances';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';

enum AvailableAssetsColumns {
  ASSET = 'asset',
  UNLOCKS = 'unlocks',
  AVAILABLE = 'available',
  VOTING_POWER = 'votingPower'
}

type AvailableAssetsRows = {
  id: string;
  [AvailableAssetsColumns.ASSET]: ReactNode;
  [AvailableAssetsColumns.UNLOCKS]: ReactNode;
  [AvailableAssetsColumns.AVAILABLE]: ReactNode;
  [AvailableAssetsColumns.VOTING_POWER]: ReactNode;
};

type AvailableAssetsTableProps = {
  balances?: BalanceData;
};

const AvailableAssetsTable = ({ balances }: AvailableAssetsTableProps): JSX.Element => {
  const [isOpen, setOpen] = useState(false);
  const prices = useGetPrices();

  const columns = [
    { name: `Total ${GOVERNANCE_TOKEN.ticker} Locked`, uid: AvailableAssetsColumns.ASSET },
    { name: 'Unlocks', uid: AvailableAssetsColumns.UNLOCKS },
    { name: 'Available to stake', uid: AvailableAssetsColumns.AVAILABLE },
    { name: `Voting Power ${VOTE_GOVERNANCE_TOKEN.ticker}`, uid: AvailableAssetsColumns.VOTING_POWER }
  ];

  const rows: AvailableAssetsRows[] = useMemo(() => {
    const data = balances ? Object.values(balances) : [];
    const filteredData = isOpen ? data : data.filter((balance) => !balance.free.isZero());

    return filteredData.map(
      ({ currency, free }): AvailableAssetsRows => {
        const asset = <AssetCell {...getCoinIconProps(currency)} />;

        const tokenPrice = getTokenPrice(prices, currency.ticker)?.usd || 0;

        const assetPriceLabel = formatUSD(getTokenPrice(prices, currency.ticker)?.usd || 0, { compact: true });
        const assetPrice = <Cell label={assetPriceLabel} />;

        const balanceLabel = free.toString();
        const balanceSublabel = formatUSD(convertMonetaryAmountToValueInUSD(free, tokenPrice) || 0, {
          compact: true
        });
        const balance = <Cell label={balanceLabel} sublabel={balanceSublabel} />;

        const actions = (
          <Flex justifyContent='flex-end' gap='spacing1'>
            <CTA size='small'>Transfer</CTA>
            <CTA size='small'>Swap</CTA>
            <CTA size='small'>Buy</CTA>
          </Flex>
        );

        return {
          id: currency.ticker,
          asset,
          assetPrice,
          balance,
          actions
        };
      }
    );
  }, [balances, isOpen, prices]);

  return <Table title='Staked' columns={columns} rows={rows} />;
};

export { AvailableAssetsTable };
export type { AvailableAssetsTableProps };

import { CurrencyExt } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { useId } from '@react-aria/utils';
import { differenceInDays, format, formatDistanceToNowStrict } from 'date-fns';
import { ReactNode, useMemo } from 'react';

import { convertMonetaryAmountToValueInUSD, formatUSD } from '@/common/utils/utils';
import { CoinIcon, Flex } from '@/component-library';
import { Cell, Table } from '@/components';
import { GOVERNANCE_TOKEN, VOTE_GOVERNANCE_TOKEN } from '@/config/relay-chains';
import { YEAR_MONTH_DAY_PATTERN } from '@/utils/constants/date-time';
import { getTokenPrice } from '@/utils/helpers/prices';
import { GetAccountStakingData } from '@/utils/hooks/api/escrow/use-get-account-staking-data';
import { useGetBalances } from '@/utils/hooks/api/tokens/use-get-balances';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';

enum StakingTableColumns {
  ASSET = 'asset',
  UNLOCKS = 'unlocks',
  AVAILABLE = 'available',
  VOTING_POWER = 'votingPower'
}

type StakingTableRows = {
  id: string;
  [StakingTableColumns.ASSET]: ReactNode;
  [StakingTableColumns.UNLOCKS]: ReactNode;
  [StakingTableColumns.AVAILABLE]: ReactNode;
  [StakingTableColumns.VOTING_POWER]: ReactNode;
};

type StakingTableProps = {
  data: GetAccountStakingData;
  votingBalance: MonetaryAmount<CurrencyExt>;
};

const StakingTable = ({ data, votingBalance }: StakingTableProps): JSX.Element => {
  const titleId = useId();
  const prices = useGetPrices();
  const { getBalance } = useGetBalances();

  const columns = [
    { name: `Total ${GOVERNANCE_TOKEN.ticker} Locked`, uid: StakingTableColumns.ASSET },
    { name: 'Unlocks', uid: StakingTableColumns.UNLOCKS },
    { name: 'Available to stake', uid: StakingTableColumns.AVAILABLE },
    { name: `Voting Power ${VOTE_GOVERNANCE_TOKEN.ticker}`, uid: StakingTableColumns.VOTING_POWER }
  ];

  const rows = useMemo((): StakingTableRows[] => {
    const { balance, unlock } = data;
    const stakingBalancePrice =
      convertMonetaryAmountToValueInUSD(balance, getTokenPrice(prices, balance.currency.ticker)?.usd) || 0;

    const asset = (
      <Flex gap='spacing2' alignItems='center'>
        <CoinIcon ticker={balance.currency.ticker} />
        <Cell label={balance.toHuman()} sublabel={formatUSD(stakingBalancePrice, { compact: true })} />
      </Flex>
    );

    const unlockDateLabel = format(unlock.date, YEAR_MONTH_DAY_PATTERN);
    const difference = differenceInDays(unlock.date, new Date());
    const unlockDaysLabel = formatDistanceToNowStrict(unlock.date);
    const unlockDaysIndicatorLabel = difference < 0 ? `-${unlockDaysLabel}` : unlockDaysLabel;
    const unlocksLabel = `${unlockDateLabel} (${unlockDaysIndicatorLabel})`;

    const unlocks = <Cell label={unlocksLabel} />;

    const available = <Cell labelColor='secondary' label={getBalance(GOVERNANCE_TOKEN.ticker)?.free.toString()} />;

    const votingPower = <Cell alignItems='flex-end' labelColor='secondary' label={votingBalance.toHuman()} />;

    return [
      {
        id: balance.currency.ticker,
        asset,
        unlocks,
        available,
        votingPower
      }
    ];
  }, [getBalance, prices, data, votingBalance]);

  return <Table title='Staked' titleId={titleId} columns={columns} rows={rows} />;
};

export { StakingTable };
export type { StakingTableProps };

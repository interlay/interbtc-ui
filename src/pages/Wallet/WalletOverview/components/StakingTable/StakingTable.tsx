import { CurrencyExt } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { useId } from '@react-aria/utils';
import { differenceInDays, format, formatDistanceToNowStrict } from 'date-fns';
import { ReactNode, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { convertMonetaryAmountToValueInUSD, formatUSD } from '@/common/utils/utils';
import { CoinIcon, Flex } from '@/component-library';
import { Cell, Table } from '@/components';
import { GOVERNANCE_TOKEN, VOTE_GOVERNANCE_TOKEN } from '@/config/relay-chains';
import { AccountStakingData } from '@/hooks/api/escrow/use-get-account-staking-data';
import { useGetBalances } from '@/hooks/api/tokens/use-get-balances';
import { useGetPrices } from '@/hooks/api/use-get-prices';
import { YEAR_MONTH_DAY_PATTERN } from '@/utils/constants/date-time';
import { getTokenPrice } from '@/utils/helpers/prices';

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
  data: AccountStakingData;
  votingBalance: MonetaryAmount<CurrencyExt>;
};

const StakingTable = ({ data, votingBalance }: StakingTableProps): JSX.Element => {
  const { t } = useTranslation();
  const titleId = useId();
  const prices = useGetPrices();
  const { getAvailableBalance } = useGetBalances();

  const columns = [
    {
      name: t('wallet_page.total_governance_locked', { token: GOVERNANCE_TOKEN.ticker }),
      uid: StakingTableColumns.ASSET
    },
    { name: t('unlocks'), uid: StakingTableColumns.UNLOCKS },
    { name: t('wallet_page.available_to_stake'), uid: StakingTableColumns.AVAILABLE },
    {
      name: t('wallet_page.voting_power_governance', { token: VOTE_GOVERNANCE_TOKEN.ticker }),
      uid: StakingTableColumns.VOTING_POWER
    }
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

    const available = <Cell labelColor='secondary' label={getAvailableBalance(GOVERNANCE_TOKEN.ticker)?.toString()} />;

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prices, data, votingBalance]);

  return <Table title={t('staked')} titleId={titleId} columns={columns} rows={rows} />;
};

export { StakingTable };
export type { StakingTableProps };

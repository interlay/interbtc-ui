
import {
  useMemo,
  useEffect,
  useState
} from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { RelayerData } from '@interlay/polkabtc-stats';

import InterlayTable from 'components/InterlayTable';
import usePolkabtcStats from 'common/hooks/use-polkabtc-stats';
import { StoreType } from 'common/types/util.types';

/**
 * TODO:
 * - Should exclude Interlay owned relayers.
 * - Should sort relayers with highest lifetime sla.
 */

interface Props {
  className?: string;
  challengeTime: number;
}

interface PatchedRelayerData extends Omit<RelayerData, 'lifetime_sla'> {
  // eslint-disable-next-line camelcase
  lifetime_sla: string;
}

const StakedRelayerScoresTable = ({
  className,
  challengeTime
}: Props) => {
  const [data, setData] = useState<(PatchedRelayerData)[]>([]);
  const { t } = useTranslation();
  const statsApi = usePolkabtcStats();
  const { polkaBtcLoaded } = useSelector((state: StoreType) => state.general);

  useEffect(() => {
    if (!polkaBtcLoaded) return;
    if (!statsApi) return;

    (async () => {
      try {
        const stakedRelayers = (await statsApi.getRelayers(challengeTime)).data;
        const sortedStakedRelayers = stakedRelayers.sort((a, b) => b.lifetime_sla - a.lifetime_sla);
        const transformedStakedRelayers = sortedStakedRelayers.map(stakedRelayer => ({
          ...stakedRelayer,
          lifetime_sla: Number(stakedRelayer.lifetime_sla).toFixed(2)
        }));

        setData(transformedStakedRelayers);
      } catch (error) {
        console.log('[StakedRelayerScoresTable] error.message => ', error.message);
      }
    })();
  }, [
    polkaBtcLoaded,
    challengeTime,
    statsApi
  ]);

  const columns = useMemo(
    () => [
      {
        Header: t('leaderboard.account_id'),
        accessor: 'id'
      },
      {
        Header: `${t('leaderboard.stake')} (DOT)`,
        accessor: 'stake'
      },
      {
        Header: t('leaderboard.block_count'),
        accessor: 'block_count'
      },
      {
        Header: t('leaderboard.lifetime_sla'),
        accessor: 'lifetime_sla'
      }
    ],
    [t]
  );

  return (
    <InterlayTable
      className={className}
      columns={columns}
      data={data} />
  );
};

export default StakedRelayerScoresTable;

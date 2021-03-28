
import {
  useMemo,
  useEffect,
  useState
} from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
// TODO: should do tree-shaking
import { VaultData } from '@interlay/polkabtc-stats';

import EllipsisLoader from 'components/EllipsisLoader';
import ErrorMessage from 'components/ErrorMessage';
import InterlayTable from 'components/UI/InterlayTable';
import usePolkabtcStats from 'common/hooks/use-polkabtc-stats';
import { StoreType } from 'common/types/util.types';
import STATUSES from 'utils/constants/statuses';

/**
 * TODO:
 * - Should exclude Interlay owned vaults.
 * - Should sort vaults with highest lifetime sla.
 */

interface Props {
  className?: string;
  // TODO: should be union type
  challengeTime: number;
}

interface PatchedVaultData extends Omit<VaultData, 'lifetime_sla'> {
  // eslint-disable-next-line camelcase
  lifetime_sla: string;
}

// TODO: should be paginated
const VaultScoresTable = ({
  className,
  challengeTime
}: Props) => {
  const { polkaBtcLoaded } = useSelector((state: StoreType) => state.general);
  const statsApi = usePolkabtcStats();
  const [data, setData] = useState<(PatchedVaultData)[]>([]);
  const [status, setStatus] = useState(STATUSES.IDLE);
  const [error, setError] = useState<Error | null>(null);
  const { t } = useTranslation();

  // TODO: should add an abort-controller
  useEffect(() => {
    // TODO: should follow `<AuthenticatedApp />` vs. `<UnauthenticatedApp />` approach
    // - (Re: https://kentcdodds.com/blog/authentication-in-react-applications)
    if (!polkaBtcLoaded) return;
    if (!statsApi) return;

    (async () => {
      try {
        setStatus(STATUSES.PENDING);
        const vaults = (await statsApi.getVaults(challengeTime)).data;
        // TODO: should be done by table sort feature
        const sortedVaults = vaults.sort((a, b) => b.lifetime_sla - a.lifetime_sla);
        const transformedVaults = sortedVaults.map(vault => ({
          ...vault,
          lifetime_sla: Number(vault.lifetime_sla).toFixed(2)
        }));
        setStatus(STATUSES.RESOLVED);

        setData(transformedVaults);
      } catch (error) {
        setStatus(STATUSES.REJECTED);
        setError(error);
      }
    })();
  }, [
    polkaBtcLoaded,
    challengeTime,
    statsApi
  ]);

  const columns = useMemo(
    () => [
      // TODO: should type properly
      {
        Header: t('leaderboard.account_id'),
        accessor: 'id'
      },
      {
        Header: `${t('leaderboard.collateral')} (DOT)`,
        accessor: 'collateral'
      },
      {
        Header: t('leaderboard.request_issue_count'),
        accessor: 'request_issue_count'
      },
      {
        Header: t('leaderboard.execute_issue_count'),
        accessor: 'execute_issue_count'
      },
      {
        Header: t('leaderboard.request_redeem_count'),
        accessor: 'request_redeem_count'
      },
      {
        Header: t('leaderboard.execute_redeem_count'),
        accessor: 'execute_redeem_count'
      },
      {
        Header: t('leaderboard.lifetime_sla'),
        accessor: 'lifetime_sla'
      }
    ],
    [t]
  );

  if (status === STATUSES.IDLE || status === STATUSES.PENDING) {
    return (
      <div className='flex justify-center'>
        <EllipsisLoader dotClassName='bg-interlayGreen' />
      </div>
    );
  }

  if (status === STATUSES.REJECTED) {
    return (
      <ErrorMessage message={error?.message} />
    );
  }

  if (status === STATUSES.RESOLVED) {
    // TODO: should optimize re-renders https://kentcdodds.com/blog/optimize-react-re-renders
    return (
      <InterlayTable
        className={className}
        columns={columns}
        data={data} />
    );
  }

  return null;
};

export default VaultScoresTable;
